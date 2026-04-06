import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/adapters/auth/authOptions";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const convos = await prisma.conversation.findMany({
    where: { participants: { some: { userId } } },
    orderBy: { updatedAt: "desc" },
    include: {
      participants: {
        include: {
          user: { select: { id: true, email: true, phone: true, businessProfile: { select: { name: true, avatarUrl: true, subdomain: true } } } },
        },
      },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const data = convos.map((c) => {
    const other = c.participants.find((p) => p.userId !== userId)?.user;
    const last = c.messages[0];
    return {
      id: c.id,
      other: {
        id: other?.id ?? "",
        name: other?.businessProfile?.name ?? other?.email ?? other?.phone ?? "Пользователь",
        avatar: other?.businessProfile?.avatarUrl ?? null,
        subdomain: other?.businessProfile?.subdomain ?? null,
      },
      lastMessage: last ? { text: last.text, createdAt: last.createdAt } : null,
      updatedAt: c.updatedAt,
    };
  });

  return NextResponse.json({ data });
}

const createSchema = z.object({ recipientId: z.string().uuid() });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  const { recipientId } = parsed.data;

  if (recipientId === userId) {
    return NextResponse.json({ error: "Cannot chat with yourself" }, { status: 400 });
  }

  const existing = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId } } },
        { participants: { some: { userId: recipientId } } },
      ],
    },
  });

  if (existing) return NextResponse.json({ data: { id: existing.id } });

  const convo = await prisma.conversation.create({
    data: {
      participants: {
        createMany: { data: [{ userId }, { userId: recipientId }] },
      },
    },
  });

  return NextResponse.json({ data: { id: convo.id } }, { status: 201 });
}
