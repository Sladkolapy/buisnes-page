import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(m: number) {
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const executorId = searchParams.get("executorId");
  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date"); // "2024-12-25"

  if (!executorId || !serviceId || !date) {
    return NextResponse.json({ error: "executorId, serviceId, date required" }, { status: 400 });
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

  const dateObj = new Date(date);
  const dayOfWeek = (dateObj.getDay() + 6) % 7; // Mon=0 ... Sun=6

  const schedule = await prisma.workSchedule.findUnique({
    where: { executorId_dayOfWeek: { executorId, dayOfWeek } },
  });

  if (!schedule?.isWorking) {
    return NextResponse.json({ data: [] });
  }

  const dayStart = new Date(`${date}T00:00:00.000Z`);
  const dayEnd = new Date(`${date}T23:59:59.999Z`);

  const existingBookings = await prisma.booking.findMany({
    where: {
      executorId,
      status: { notIn: ["CANCELLED", "NO_SHOW"] },
      startAt: { gte: dayStart, lte: dayEnd },
    },
  });

  const duration = service.durationMinutes;
  const workStart = timeToMinutes(schedule.startTime);
  const workEnd = timeToMinutes(schedule.endTime);
  const lunchStart = schedule.lunchStart ? timeToMinutes(schedule.lunchStart) : null;
  const lunchEnd = schedule.lunchEnd ? timeToMinutes(schedule.lunchEnd) : null;
  const now = new Date();
  const isToday = dateObj.toDateString() === now.toDateString();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const slots: string[] = [];
  let cursor = workStart;

  while (cursor + duration <= workEnd) {
    // Skip slots that overlap with the lunch break
    if (lunchStart !== null && lunchEnd !== null) {
      const slotEndMin = cursor + duration;
      if (cursor < lunchEnd && slotEndMin > lunchStart) {
        cursor = lunchEnd;
        continue;
      }
    }

    if (!isToday || cursor > nowMinutes + 30) {
      const slotStart = new Date(`${date}T${minutesToTime(cursor)}:00.000Z`);
      const slotEnd = new Date(slotStart.getTime() + duration * 60000);

      const hasOverlap = existingBookings.some((b) => {
        const bStart = new Date(b.startAt);
        const bEnd = new Date(b.endAt);
        return bStart < slotEnd && bEnd > slotStart;
      });

      if (!hasOverlap) slots.push(minutesToTime(cursor));
    }
    cursor += 30;
  }

  return NextResponse.json({ data: slots });
}
