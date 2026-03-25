import { NextRequest, NextResponse } from "next/server";
import { container } from "@/config/containers";
import { BusinessRuleException } from "@/core/shared/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, role } = body as {
      email?: string;
      phone?: string;
      role?: string;
    };

    const user = await container.registerUser.execute({ email, phone, role });

    return NextResponse.json(
      {
        id: user.getId().getValue(),
        email: user.getEmail()?.getValue() ?? null,
        phone: user.getPhone()?.getValue() ?? null,
        role: user.getRole(),
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof BusinessRuleException) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }

    console.error("[POST /api/auth/register]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
