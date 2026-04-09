import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/adapters/auth/authOptions";
import { getPrisma } from "@/config/containers";
import { BookingStatus } from "@prisma/client";

const prisma = getPrisma();

const patchSchema = z.object({
  status: z.nativeEnum(BookingStatus),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = (session.user as { id?: string }).id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.businessProfile.findUnique({ where: { userId: uid } });
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

  const { id } = await params;
  const booking = await prisma.booking.findFirst({ where: { id, businessProfileId: profile.id } });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = patchSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 422 });

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: body.data.status },
    include: { executor: true, service: true, client: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json({ data: updated });
}
