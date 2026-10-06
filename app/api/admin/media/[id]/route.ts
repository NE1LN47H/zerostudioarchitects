import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import { deleteMediaItem } from "@/lib/db/service";
import { deleteImage } from "@/lib/cloudinary";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    // id may be the publicId (URI encoded)
    const publicId = decodeURIComponent(id);
    await deleteImage(publicId);
    const success = await deleteMediaItem(publicId);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
