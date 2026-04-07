"use client";

import { useState } from "react";

type Folder = "avatars" | "portfolio" | "backgrounds";

interface UploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

export function useCloudinaryUpload(folder: Folder = "avatars") {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File): Promise<UploadResult | null> {
    setUploading(true);
    setError(null);
    try {
      const sigRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });
      if (!sigRes.ok) {
        const errBody = await sigRes.text().catch(() => sigRes.status.toString());
        console.error("[upload] signature error", sigRes.status, errBody);
        throw new Error(`Signature error ${sigRes.status}: ${errBody}`);
      }
      const { signature, timestamp, folder: cloudFolder, apiKey, cloudName } =
        (await sigRes.json()) as {
          signature: string;
          timestamp: number;
          folder: string;
          apiKey: string;
          cloudName: string;
        };

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", cloudFolder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData },
      );
      if (!uploadRes.ok) {
        const errBody = await uploadRes.text().catch(() => uploadRes.status.toString());
        console.error("[upload] cloudinary error", uploadRes.status, errBody);
        throw new Error(`Upload failed ${uploadRes.status}: ${errBody}`);
      }
      const data = (await uploadRes.json()) as UploadResult;
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload error");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function remove(publicId: string): Promise<boolean> {
    const res = await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });
    return res.ok;
  }

  return { upload, remove, uploading, error };
}
