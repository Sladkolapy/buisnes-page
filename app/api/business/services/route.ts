import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/adapters/auth/authOptions";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

const createSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  durationMinutes: z.number().int().min(15).max(480).default(60),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = (session.user as { id?: string }).id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.businessProfile.findUnique({ where: { userId: uid } });
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

  const services = await prisma.service.findMany({
    where: { businessProfileId: profile.id },
    include: { executors: { include: { executor: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ data: services });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = (session.user as { id?: string }).id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.businessProfile.findUnique({ where: { userId: uid } });
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

  const body = createSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 422 });

  const service = await prisma.service.create({
    data: { businessProfileId: profile.id, ...body.data },
    include: { executors: true },
  });

  return NextResponse.json({ data: service }, { status: 201 });
}
