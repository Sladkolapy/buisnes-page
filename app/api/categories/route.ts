import { NextResponse } from "next/server";
import { getPrisma } from "@/config/containers";
import { MOCK_CATEGORIES } from "@/lib/mock/categories";

const prisma = getPrisma();

export async function GET() {
  const rows = await prisma.category.findMany({
    orderBy: [{ parentId: "asc" }, { order: "asc" }],
    select: { id: true, name: true, slug: true, icon: true, order: true, parentId: true },
  });

  if (rows.length === 0) {
    return NextResponse.json({ data: MOCK_CATEGORIES.sort((a, b) => a.order - b.order) });
  }

  const data = rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    icon: r.icon,
    order: r.order,
    parentId: r.parentId,
    level: (r.parentId === null ? 0 : 1) as 0 | 1,
  }));

  return NextResponse.json({ data });
}
