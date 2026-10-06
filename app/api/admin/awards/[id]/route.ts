import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import { updateAward, deleteAward, getAwards } from "@/lib/db/service";
import { deleteImage } from "@/lib/cloudinary";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await updateAward(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, award: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const all = await getAwards(false);
    const existing = all.find((a) => a.id === id);

    if (existing?.imagePublicId) {
      await deleteImage(existing.imagePublicId);
    }

    const success = await deleteAward(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
