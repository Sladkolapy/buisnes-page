import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/adapters/auth/authOptions";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") return null;
  return (session!.user as { id?: string }).id ?? null;
}

export async function GET() {
  const uid = await requireAdmin();
  if (!uid) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      blockReason: true,
      createdAt: true,
      businessProfile: { select: { id: true, name: true, subdomain: true, isPublished: true } },
    },
  });

  return NextResponse.json(users);
}
