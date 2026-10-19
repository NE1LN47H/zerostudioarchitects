import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import { getPublications, createPublication } from "@/services";

export async function GET(req: NextRequest) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const publications = await getPublications(false);
    return NextResponse.json({ publications });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { title, platform, year } = body;

    if (!title || !platform) {
      return NextResponse.json(
        { error: "Title and platform are required" },
        { status: 400 }
      );
    }

    const newPub = await createPublication({
      title,
      platform,
      project: body.project || "",
      url: body.url || "",
      year: year || new Date().getFullYear().toString(),
      format: body.format || "Online Feature",
      description: body.description || "",
      image: body.image || "/projects/HAVEN/1-opt.jpg",
      imagePublicId: body.imagePublicId,
      order: body.order ?? 99,
      curated: body.curated ?? false,
      visible: body.visible ?? true,
    });

    return NextResponse.json({ success: true, publication: newPub }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
