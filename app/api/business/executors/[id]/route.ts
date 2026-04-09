import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/adapters/auth/authOptions";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

const patchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  specialization: z.string().max(200).optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  schedules: z.array(z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string(),
    endTime: z.string(),
    isWorking: z.boolean(),
  })).optional(),
  serviceIds: z.array(z.object({
    serviceId: z.string(),
    priceKopecks: z.number().int().min(0),
  })).optional(),
});

async function getOwnedExecutor(executorId: string, userId: string) {
  const profile = await prisma.businessProfile.findUnique({ where: { userId } });
  if (!profile) return null;
  return prisma.executor.findFirst({ where: { id: executorId, businessProfileId: profile.id } });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = (session.user as { id?: string }).id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const executor = await getOwnedExecutor(id, uid);
  if (!executor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = patchSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 422 });

  const { schedules, serviceIds, ...rest } = body.data;

  await prisma.executor.update({ where: { id }, data: rest });

  if (schedules) {
    for (const s of schedules) {
      await prisma.workSchedule.upsert({
        where: { executorId_dayOfWeek: { executorId: id, dayOfWeek: s.dayOfWeek } },
        create: { executorId: id, ...s },
        update: { startTime: s.startTime, endTime: s.endTime, isWorking: s.isWorking },
      });
    }
  }

  if (serviceIds !== undefined) {
    await prisma.executorService.deleteMany({ where: { executorId: id } });
    if (serviceIds.length > 0) {
      await prisma.executorService.createMany({
        data: serviceIds.map((s) => ({ executorId: id, serviceId: s.serviceId, priceKopecks: s.priceKopecks })),
      });
    }
  }

  const updated = await prisma.executor.findUnique({
    where: { id },
    include: { services: { include: { service: true } }, schedules: { orderBy: { dayOfWeek: "asc" } } },
  });

  return NextResponse.json({ data: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = (session.user as { id?: string }).id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const executor = await getOwnedExecutor(id, uid);
  if (!executor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.executor.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
