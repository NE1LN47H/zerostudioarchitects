import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import { reorderJournalArticles } from "@/lib/db/service";

export async function POST(req: NextRequest) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const { orderedSlugs } = await req.json();
    if (!Array.isArray(orderedSlugs)) {
      return NextResponse.json({ error: "orderedSlugs must be an array" }, { status: 400 });
    }

    await reorderJournalArticles(orderedSlugs);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
