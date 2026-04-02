import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/adapters/auth/authOptions";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const categories = await prisma.category.findMany({
    orderBy: [{ parentId: "asc" }, { order: "asc" }],
  });

  return NextResponse.json({ data: categories });
}

const createSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  icon: z.string().max(10).nullable().optional(),
  order: z.number().int().default(0),
  parentId: z.string().uuid().nullable().optional(),
});

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { name, slug, icon, order, parentId } = parsed.data;

  const exists = await prisma.category.findUnique({ where: { slug } });
  if (exists) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const category = await prisma.category.create({
    data: { name, slug, icon: icon ?? null, order, parentId: parentId ?? null },
  });

  return NextResponse.json({ data: category }, { status: 201 });
}
