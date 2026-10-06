import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { createMediaItem } from "@/lib/db/service";

export async function POST(req: NextRequest) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "zerostudio";

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      // Read file buffer and convert to base64 data URI
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mime = file.type || "image/jpeg";
      const base64 = `data:${mime};base64,${buffer.toString("base64")}`;

      const uploadResult = await uploadImage(base64, folder);

      // Persist in media library
      const mediaItem = await createMediaItem({
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        originalFilename: file.name,
        sizeBytes: uploadResult.sizeBytes || file.size,
      });

      return NextResponse.json({
        success: true,
        asset: {
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          mediaId: mediaItem.id,
        },
      });
    }

    // JSON base64 upload
    const body = await req.json();
    const { dataUri, folder = "zerostudio", filename = "image.jpg" } = body;

    if (!dataUri) {
      return NextResponse.json({ error: "Missing dataUri in request" }, { status: 400 });
    }

    const uploadResult = await uploadImage(dataUri, folder);
    const mediaItem = await createMediaItem({
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      originalFilename: filename,
      sizeBytes: uploadResult.sizeBytes,
    });

    return NextResponse.json({
      success: true,
      asset: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        mediaId: mediaItem.id,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
