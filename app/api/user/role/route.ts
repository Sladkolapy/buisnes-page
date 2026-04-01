import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/adapters/auth/authOptions";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

const UPGRADEABLE_ROLES = ["SOLO_MASTER", "BUSINESS_OWNER"] as const;
const ROLE_HIERARCHY: Record<string, number> = {
  CLIENT: 0,
  SOLO_MASTER: 1,
  BUSINESS_OWNER: 1,
  ADMIN: 2,
};

const schema = z.object({
  role: z.enum(UPGRADEABLE_ROLES),
});

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const uid = (session.user as { id?: string }).id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 422 });

  const current = await prisma.user.findUnique({ where: { id: uid }, select: { role: true } });
  if (!current) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (ROLE_HIERARCHY[current.role] >= ROLE_HIERARCHY[body.data.role]) {
    return NextResponse.json({ error: "Cannot downgrade role" }, { status: 422 });
  }

  await prisma.user.update({ where: { id: uid }, data: { role: body.data.role } });

  return NextResponse.json({ ok: true, role: body.data.role });
}
