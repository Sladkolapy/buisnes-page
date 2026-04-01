import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/adapters/auth/authOptions";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (user?.role !== "ADMIN") return null;
  return user?.id ?? null;
}

const schema = z.object({
  action: z.enum(["block", "unblock"]),
  reason: z.string().max(300).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const adminId = await requireAdmin();
  if (!adminId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 422 });

  if (id === adminId) {
    return NextResponse.json({ error: "Cannot modify own account" }, { status: 422 });
  }

  const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (target.role === "ADMIN") {
    return NextResponse.json({ error: "Cannot modify another admin" }, { status: 422 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data:
      body.data.action === "block"
        ? { status: "BLOCKED", blockReason: body.data.reason ?? "Blocked by admin", blockedBy: adminId }
        : { status: "ACTIVE", blockReason: null, blockedBy: null },
    select: { id: true, status: true, blockReason: true },
  });

  return NextResponse.json(updated);
}
