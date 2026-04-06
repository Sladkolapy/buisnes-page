import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import Ably from "ably";
import { authOptions } from "@/adapters/auth/authOptions";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;
  const { id: conversationId } = await params;

  const member = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, email: true, businessProfile: { select: { name: true, avatarUrl: true } } } } },
    take: 100,
  });

  return NextResponse.json({ data: messages });
}

const sendSchema = z.object({ text: z.string().min(1).max(4000) });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;
  const { id: conversationId } = await params;

  const member = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const message = await prisma.message.create({
    data: { conversationId, senderId: userId, text: parsed.data.text },
    include: { sender: { select: { id: true, email: true, businessProfile: { select: { name: true, avatarUrl: true } } } } },
  });

  await prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });

  const ably = new Ably.Rest(process.env.ABLY_API_KEY!);
  const channel = ably.channels.get(`chat:${conversationId}`);
  await channel.publish("message", {
    id: message.id,
    text: message.text,
    senderId: message.senderId,
    senderName: message.sender.businessProfile?.name ?? message.sender.email ?? "Пользователь",
    senderAvatar: message.sender.businessProfile?.avatarUrl ?? null,
    createdAt: message.createdAt,
  });

  return NextResponse.json({ data: message }, { status: 201 });
}
