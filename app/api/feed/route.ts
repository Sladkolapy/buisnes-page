import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = 12;
  const skip = (page - 1) * limit;

  const where = {
    isPublished: true,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [profiles, total] = await Promise.all([
    prisma.businessProfile.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        subdomain: true,
        avatarUrl: true,
        user: { select: { role: true } },
      },
    }),
    prisma.businessProfile.count({ where }),
  ]);

  return NextResponse.json({ profiles, total, page, pages: Math.ceil(total / limit) });
}
