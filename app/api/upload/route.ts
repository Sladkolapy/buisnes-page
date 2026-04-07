import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { v2 as cloudinary } from "cloudinary";
import { authOptions } from "@/adapters/auth/authOptions";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_FOLDERS = ["avatars", "portfolio", "backgrounds"] as const;
type Folder = (typeof ALLOWED_FOLDERS)[number];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string })?.id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { folder = "avatars" } = (await req.json()) as { folder?: Folder };
  if (!ALLOWED_FOLDERS.includes(folder as Folder)) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const publicFolder = `beauty-platform/${folder}/${uid}`;

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: publicFolder },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder: publicFolder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string })?.id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { publicId } = (await req.json()) as { publicId: string };
  if (!publicId?.includes(uid)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await cloudinary.uploader.destroy(publicId);
  return NextResponse.json({ ok: true });
}
