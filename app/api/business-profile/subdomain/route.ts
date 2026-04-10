import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/adapters/auth/authOptions";
import { getPrisma } from "@/config/containers";

const prisma = getPrisma();

const SUBDOMAIN_RE = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;

const RESERVED = [
  "www", "app", "api", "admin", "mail", "smtp", "ftp", "cdn",
  "static", "auth", "login", "register", "help", "support",
  "blog", "shop", "store", "about", "contact",
];

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const uid = (session.user as { id?: string }).id;
  const value = req.nextUrl.searchParams.get("value")?.toLowerCase().trim() ?? "";

  if (!value) return NextResponse.json({ available: false, valid: false, reason: "empty" });

  if (!SUBDOMAIN_RE.test(value)) {
    return NextResponse.json({ available: false, valid: false, reason: "format" });
  }

  if (RESERVED.includes(value)) {
    return NextResponse.json({ available: false, valid: false, reason: "reserved" });
  }

  const existing = await prisma.businessProfile.findUnique({ where: { subdomain: value } });

  if (existing) {
    const isOwn = existing.userId === uid;
    return NextResponse.json({ available: isOwn, valid: true, reason: isOwn ? "own" : "taken" });
  }

  return NextResponse.json({ available: true, valid: true, reason: "free" });
}
