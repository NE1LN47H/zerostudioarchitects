import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import { getMediaItems } from "@/lib/db/service";

export async function GET(req: NextRequest) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const media = await getMediaItems();
    return NextResponse.json({ media });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
