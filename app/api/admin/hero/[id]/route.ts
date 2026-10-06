import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import { updateHeroItem, deleteHeroItem, getHeroItems } from "@/lib/db/service";
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

    if (body.category || body.year) {
      body.meta = `${body.category || ""} · ${body.year || ""}`.trim().replace(/^·\s*|·\s*$/g, "");
    }

    const updated = await updateHeroItem(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const items = await getHeroItems(false);
    const existing = items.find((h) => h.id === id);

    if (existing?.imagePublicId) {
      await deleteImage(existing.imagePublicId);
    }

    const success = await deleteHeroItem(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
