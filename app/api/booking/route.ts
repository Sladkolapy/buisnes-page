import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/adapters/auth/authOptions";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

const createSchema = z.object({
  businessProfileId: z.string(),
  executorId: z.string(),
  serviceId: z.string(),
  date: z.string(), // "2024-12-25"
  time: z.string(), // "14:00"
  clientName: z.string().min(1).max(100),
  clientPhone: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const uid = session ? (session.user as { id?: string }).id : undefined;

  const body = createSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 422 });

  const { businessProfileId, executorId, serviceId, date, time, clientName, clientPhone, notes } = body.data;

  const service = await prisma.service.findFirst({
    where: { id: serviceId, businessProfileId, isActive: true },
  });
  if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

  const executor = await prisma.executor.findFirst({
    where: { id: executorId, businessProfileId, isActive: true },
  });
  if (!executor) return NextResponse.json({ error: "Executor not found" }, { status: 404 });

  const startAt = new Date(`${date}T${time}:00.000Z`);
  const endAt = new Date(startAt.getTime() + service.durationMinutes * 60000);

  // Double-check no overlap
  const overlap = await prisma.booking.findFirst({
    where: {
      executorId,
      status: { notIn: ["CANCELLED", "NO_SHOW"] },
      OR: [{ startAt: { lt: endAt }, endAt: { gt: startAt } }],
    },
  });
  if (overlap) return NextResponse.json({ error: "Slot already taken" }, { status: 409 });

  const booking = await prisma.booking.create({
    data: {
      businessProfileId,
      executorId,
      serviceId,
      clientId: uid ?? null,
      startAt,
      endAt,
      clientName,
      clientPhone,
      notes,
    },
    include: { executor: true, service: true },
  });

  return NextResponse.json({ data: booking }, { status: 201 });
}
