import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/adapters/auth/authOptions";
import { getPrisma } from "@/config/containers";
import type { WidgetData } from "@/core/shared/widget-types";

function toJson(v: unknown): Prisma.InputJsonValue {
  return v as unknown as Prisma.InputJsonValue;
}

const prisma = getPrisma();

async function getProfileForUser(uid: string) {
  const profile = await prisma.businessProfile.findUnique({ where: { userId: uid } });
  if (!profile) return null;
  return {
    ...profile,
    widgets: (profile.widgetsJson as unknown as WidgetData[]) ?? [],
  };
}

async function requireAuth() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  return uid ?? null;
}

const widgetSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  content: z.record(z.string(), z.any()),
  position: z.number(),
  isVisible: z.boolean(),
});

export async function POST(req: NextRequest) {
  const uid = await requireAuth();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getProfileForUser(uid);
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

  const body = widgetSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 422 });

  const updated = [...profile.widgets, body.data];
  await prisma.businessProfile.update({
    where: { userId: uid },
    data: { widgetsJson: toJson(updated) },
  });

  return NextResponse.json(body.data, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const uid = await requireAuth();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getProfileForUser(uid);
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

  const body = widgetSchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 422 });

  const updated = profile.widgets.map((w) => (w.id === body.data.id ? body.data : w));
  await prisma.businessProfile.update({
    where: { userId: uid },
    data: { widgetsJson: toJson(updated) },
  });

  return NextResponse.json(body.data);
}

export async function DELETE(req: NextRequest) {
  const uid = await requireAuth();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = (await req.json()) as { id: string };
  const profile = await getProfileForUser(uid);
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

  const updated = profile.widgets
    .filter((w) => w.id !== id)
    .map((w, i) => ({ ...w, position: i }));

  await prisma.businessProfile.update({
    where: { userId: uid },
    data: { widgetsJson: toJson(updated) },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const uid = await requireAuth();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getProfileForUser(uid);
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

  const { widgets } = (await req.json()) as { widgets: WidgetData[] };

  await prisma.businessProfile.update({
    where: { userId: uid },
    data: { widgetsJson: toJson(widgets) },
  });

  return NextResponse.json({ ok: true });
}
