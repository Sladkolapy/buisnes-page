import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/adapters/auth/authOptions";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "ADMIN") return null;
  return session;
}

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
  icon: z.string().max(10).nullable().optional(),
  order: z.number().int().optional(),
  parentId: z.string().uuid().nullable().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { name, slug, icon, order, parentId } = parsed.data;

  if (slug) {
    const conflict = await prisma.category.findFirst({
      where: { slug, NOT: { id } },
    });
    if (conflict) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(icon !== undefined && { icon }),
      ...(order !== undefined && { order }),
      ...(parentId !== undefined && { parentId }),
    },
  });

  return NextResponse.json({ data: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const children = await prisma.category.count({ where: { parentId: id } });
  if (children > 0) {
    return NextResponse.json(
      { error: "Удалите сначала все подкатегории" },
      { status: 400 },
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
