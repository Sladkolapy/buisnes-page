import { NextRequest, NextResponse } from "next/server";
import { container, getPrisma } from "@/config/containers";
import { BusinessRuleException } from "@/core/shared/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, role, name } = body as {
      email?: string;
      phone?: string;
      role?: string;
      name?: string;
    };

    const user = await container.registerUser.execute({ email, phone, role });
    const userId = user.getId().getValue();

    if (name?.trim()) {
      await getPrisma().user.update({
        where: { id: userId },
        data: { name: name.trim() },
      });
    }

    return NextResponse.json(
      {
        id: userId,
        email: user.getEmail()?.getValue() ?? null,
        phone: user.getPhone()?.getValue() ?? null,
        role: user.getRole(),
        name: name?.trim() ?? null,
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
