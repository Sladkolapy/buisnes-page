import { NextResponse } from "next/server";

export async function getHealthResponse() {
  return NextResponse.json({ status: "ok" });
}
