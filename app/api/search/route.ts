import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getMockProfiles } from "@/lib/mock/profiles";

const schema = z.object({
  q: z.string().default(""),
  categoryId: z.string().nullable().default(null),
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
    city: searchParams.get("city") || null,
    sortBy: searchParams.get("sortBy") ?? "date",
    sortOrder: searchParams.get("sortOrder") ?? "desc",
    page: searchParams.get("page") ?? "1",
    limit: searchParams.get("limit") ?? "20",
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { q, categoryId, sortBy, sortOrder, page, limit } = parsed.data;

  const { data, total } = getMockProfiles(page, limit, { query: q, categoryId, sortBy, sortOrder });

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      hasMore: page * limit < total,
    },
  });
}
