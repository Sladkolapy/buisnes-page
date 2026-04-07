import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/adapters/auth/authOptions";
import { getPrisma } from "@/config/containers";
import type { WidgetData } from "@/core/shared/widget-types";
import type { BusinessProfileData } from "@/core/shared/widget-types";

const prisma = getPrisma();

function toResponse(p: {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  subdomain: string | null;
  avatarUrl: string | null;
  backgroundUrl?: string | null;
  bgColor?: string | null;
  accentColor?: string | null;
  isPublished: boolean;
  widgetsJson: unknown;
}): BusinessProfileData {
  return {
    id: p.id,
    userId: p.userId,
    name: p.name,
    description: p.description ?? undefined,
    subdomain: p.subdomain ?? undefined,
    avatarUrl: p.avatarUrl ?? undefined,
    backgroundUrl: p.backgroundUrl ?? undefined,
    bgColor: p.bgColor ?? "#ffffff",
    accentColor: p.accentColor ?? "#7c3aed",
    isPublished: p.isPublished,
    widgets: (p.widgetsJson as unknown as WidgetData[]) ?? [],
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const uid = (session.user as { id?: string }).id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.businessProfile.findUnique({ where: { userId: uid } });
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(toResponse(profile));
}

const createSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  role: z.enum(["SOLO_MASTER", "BUSINESS_OWNER"]),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const uid = (session.user as { id?: string }).id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.businessProfile.findUnique({ where: { userId: uid } });
  if (existing) return NextResponse.json({ error: "Profile already exists" }, { status: 409 });

  const body = createSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 422 });

  const subdomain = body.data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63)
    .replace(/-+$/, "");

  const uniqueSub = await ensureUniqueSubdomain(subdomain);

  const [profile] = await prisma.$transaction([
    prisma.businessProfile.create({
      data: {
        userId: uid,
        name: body.data.name,
        description: body.data.description,
        subdomain: uniqueSub,
      },
    }),
    prisma.user.update({ where: { id: uid }, data: { role: body.data.role } }),
  ]);

  return NextResponse.json(toResponse(profile), { status: 201 });
}

const patchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  avatarUrl: z.string().optional().nullable(),
  backgroundUrl: z.string().optional().nullable(),
  bgColor: z.string().optional().nullable(),
  accentColor: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
  widgets: z.array(z.any()).optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const uid = (session.user as { id?: string }).id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = patchSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 422 });

  const { widgets, ...rest } = body.data;

  const profile = await prisma.businessProfile.update({
    where: { userId: uid },
    data: {
      ...rest,
      ...(widgets !== undefined ? { widgetsJson: widgets } : {}),
    },
  });

  return NextResponse.json(toResponse(profile));
}

async function ensureUniqueSubdomain(base: string): Promise<string> {
  let candidate = base || "page";
  let suffix = 0;
  while (await prisma.businessProfile.findUnique({ where: { subdomain: candidate } })) {
    suffix++;
    candidate = `${base}-${suffix}`;
  }
  return candidate;
}
