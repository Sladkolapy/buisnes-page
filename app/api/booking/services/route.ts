import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const businessProfileId = searchParams.get("businessProfileId");
  if (!businessProfileId) return NextResponse.json({ error: "businessProfileId required" }, { status: 400 });

  const services = await prisma.service.findMany({
    where: { businessProfileId, isActive: true },
    include: {
      executors: {
        where: { executor: { isActive: true } },
        include: { executor: { select: { id: true, name: true, specialization: true, avatarUrl: true } } },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Only include services that have at least one active executor
  const data = services.filter((s) => s.executors.length > 0);
  return NextResponse.json({ data });
}
