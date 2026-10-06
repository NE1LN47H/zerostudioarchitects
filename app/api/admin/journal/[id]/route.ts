import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import { getArticleBySlug, updateJournalArticle, deleteJournalArticle } from "@/lib/db/service";
import { deleteImage } from "@/lib/cloudinary";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const article = await getArticleBySlug(id);
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ article });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await updateJournalArticle(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, article: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const existing = await getArticleBySlug(id);

    if (existing) {
      if (existing.imagePublicId) await deleteImage(existing.imagePublicId);
      if (existing.content?.secondaryImagePublicId) {
        await deleteImage(existing.content.secondaryImagePublicId);
      }
    }

    const success = await deleteJournalArticle(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
