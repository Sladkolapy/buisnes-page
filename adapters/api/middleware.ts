import { NextResponse } from "next/server";

export function adapterMiddleware() {
  return NextResponse.next();
}

export const middlewareConfig = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
