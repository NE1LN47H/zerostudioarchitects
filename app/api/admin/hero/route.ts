import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import { getHeroItems, createHeroItem } from "@/lib/db/service";

export async function GET(req: NextRequest) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const items = await getHeroItems(false);
    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { image, imagePublicId, title, category, year, projectSlug, order, visible } = body;

    if (!image || !title) {
      return NextResponse.json(
        { error: "Image and title are required" },
        { status: 400 }
      );
    }

    const newItem = await createHeroItem({
      image,
      imagePublicId,
      title,
      category: category || "RESIDENTIAL",
      year: year || new Date().getFullYear().toString(),
      meta: `${category || "RESIDENTIAL"} · ${year || new Date().getFullYear()}`,
      projectSlug,
      order: order ?? 99,
      visible: visible ?? true,
    });

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
