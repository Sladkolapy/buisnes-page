import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/adapters/auth/authOptions";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

export async function GET() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string })?.id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: uid },
    select: { id: true, name: true, avatarUrl: true, email: true, phone: true, role: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ data: user });
}

const updateSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  avatarUrl: z.string().max(500000).nullable().optional(),
});

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string })?.id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const { name, avatarUrl } = parsed.data;
  const updated = await prisma.user.update({
    where: { id: uid },
    data: {
      ...(name !== undefined && { name }),
      ...(avatarUrl !== undefined && { avatarUrl }),
    },
    select: { id: true, name: true, avatarUrl: true },
  });

  return NextResponse.json({ data: updated });
}
