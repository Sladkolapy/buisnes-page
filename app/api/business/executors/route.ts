import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/adapters/auth/authOptions";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

async function getProfile(userId: string) {
  return prisma.businessProfile.findUnique({ where: { userId } });
}

const createSchema = z.object({
  name: z.string().min(1).max(100),
  specialization: z.string().max(200).optional(),
  avatarUrl: z.string().optional().nullable(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = (session.user as { id?: string }).id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getProfile(uid);
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

  const executors = await prisma.executor.findMany({
    where: { businessProfileId: profile.id },
    include: {
      services: { include: { service: true } },
      schedules: { orderBy: { dayOfWeek: "asc" } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ data: executors });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = (session.user as { id?: string }).id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getProfile(uid);
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

  const body = createSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 422 });

  const executor = await prisma.executor.create({
    data: {
      businessProfileId: profile.id,
      name: body.data.name,
      specialization: body.data.specialization,
      avatarUrl: body.data.avatarUrl,
    },
    include: { services: true, schedules: true },
  });

  // Create default weekly schedule (Mon–Fri working)
  await prisma.workSchedule.createMany({
    data: Array.from({ length: 7 }, (_, i) => ({
      executorId: executor.id,
      dayOfWeek: i,
      isWorking: i < 5,
      startTime: "09:00",
      endTime: "18:00",
    })),
  });

  return NextResponse.json({ data: executor }, { status: 201 });
}
