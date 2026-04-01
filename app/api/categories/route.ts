import { NextResponse } from "next/server";
import { MOCK_CATEGORIES } from "@/lib/mock/categories";

export async function GET() {
  return NextResponse.json({ data: MOCK_CATEGORIES });
}
