import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import { getAwards, createAward } from "@/lib/db/service";

export async function GET(req: NextRequest) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const awards = await getAwards(false);
    return NextResponse.json({ awards });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { award, project, organization, category, year } = body;

    if (!award || !organization) {
      return NextResponse.json(
        { error: "Award title and organization are required" },
        { status: 400 }
      );
    }

    const newAward = await createAward({
      number: body.number || "01",
      award,
      project: project || "Zero Studio",
      organization,
      category: category || "Excellence in Architecture",
      year: year || new Date().getFullYear().toString(),
      description: body.description,
      image: body.image,
      imagePublicId: body.imagePublicId,
      order: body.order ?? 99,
      curated: body.curated ?? false,
      visible: body.visible ?? true,
      type: body.type || (body.curated ? "curated" : "project"),
    });

    return NextResponse.json({ success: true, award: newAward }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
