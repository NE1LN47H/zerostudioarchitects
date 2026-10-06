import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import { getAboutContent, updateAboutContent } from "@/lib/db/service";

export async function GET(req: NextRequest) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const about = await getAboutContent();
    return NextResponse.json({ about });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const updated = await updateAboutContent(body);
    return NextResponse.json({ success: true, about: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
