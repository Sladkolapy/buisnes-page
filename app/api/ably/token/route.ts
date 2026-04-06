import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Ably from "ably";
import { authOptions } from "@/adapters/auth/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = new Ably.Rest(process.env.ABLY_API_KEY!);
  const tokenParams = { clientId: session.user.id };

  const tokenRequest = await client.auth.createTokenRequest(tokenParams);
  return NextResponse.json(tokenRequest);
}
