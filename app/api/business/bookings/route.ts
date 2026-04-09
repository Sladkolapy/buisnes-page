import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/adapters/auth/authOptions";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = (session.user as { id?: string }).id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.businessProfile.findUnique({ where: { userId: uid } });
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const executorId = searchParams.get("executorId");

  const bookings = await prisma.booking.findMany({
    where: {
      businessProfileId: profile.id,
      ...(executorId ? { executorId } : {}),
      ...(from && to ? { startAt: { gte: new Date(from), lte: new Date(to) } } : {}),
    },
    include: {
      executor: true,
      service: true,
      client: { select: { id: true, name: true, email: true, avatarUrl: true } },
    },
    orderBy: { startAt: "asc" },
  });

  return NextResponse.json({ data: bookings });
}
