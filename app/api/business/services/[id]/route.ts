import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/adapters/auth/authOptions";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

const patchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  durationMinutes: z.number().int().min(15).max(480).optional(),
  isActive: z.boolean().optional(),
});

async function getOwnedService(serviceId: string, userId: string) {
  const profile = await prisma.businessProfile.findUnique({ where: { userId } });
  if (!profile) return null;
  return prisma.service.findFirst({ where: { id: serviceId, businessProfileId: profile.id } });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = (session.user as { id?: string }).id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const service = await getOwnedService(id, uid);
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = patchSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 422 });

  const updated = await prisma.service.update({
    where: { id },
    data: body.data,
    include: { executors: { include: { executor: true } } },
  });

  return NextResponse.json({ data: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = (session.user as { id?: string }).id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const service = await getOwnedService(id, uid);
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
