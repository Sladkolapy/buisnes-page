import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

const schema = z.object({
  q: z.string().default(""),
  categoryId: z.string().nullable().default(null),
  subcategoryId: z.string().nullable().default(null),
  city: z.string().nullable().default(null),
  sortBy: z.enum(["date", "rating", "name"]).default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const parsed = schema.safeParse({
    q: searchParams.get("q") ?? "",
    categoryId: searchParams.get("categoryId") || null,
    subcategoryId: searchParams.get("subcategoryId") || null,
    city: searchParams.get("city") || null,
    sortBy: searchParams.get("sortBy") ?? "date",
    sortOrder: searchParams.get("sortOrder") ?? "desc",
    page: searchParams.get("page") ?? "1",
    limit: searchParams.get("limit") ?? "20",
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { q, sortBy, sortOrder, page, limit } = parsed.data;
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

  const orderBy =
    sortBy === "name"
      ? { name: sortOrder as "asc" | "desc" }
      : { createdAt: sortOrder as "asc" | "desc" };

  const [records, total] = await Promise.all([
    prisma.businessProfile.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        subdomain: true,
        avatarUrl: true,
        isPublished: true,
        widgetsJson: true,
      },
    }),
    prisma.businessProfile.count({ where }),
  ]);

  type WidgetRow = { type: string; isVisible: boolean; position: number; content?: { items?: { name: string; price: string; unit?: string }[] } };

  const data = records
    .filter((r) => r.subdomain !== null)
    .map((r) => {
      const widgets = (r.widgetsJson as unknown as WidgetRow[]) ?? [];
      const priceWidget = widgets
        .filter((w) => w.type === "PRICE_LIST" && w.isVisible)
        .sort((a, b) => a.position - b.position)[0];
      const pricePreview = priceWidget?.content?.items?.slice(0, 3).map((i) => ({
        name: i.name,
        price: i.price,
        unit: i.unit,
      })) ?? null;

      return {
        id: r.id,
        businessName: r.name,
        avatar: r.avatarUrl,
        description: r.description,
        rating: 0,
        subdomain: r.subdomain!,
        categoryIds: [] as string[],
        subcategoryIds: [] as string[],
        isPublished: r.isPublished,
        pricePreview,
      };
    });

  return NextResponse.json({
    data,
    pagination: { page, limit, total, hasMore: page * limit < total },
  });
}
