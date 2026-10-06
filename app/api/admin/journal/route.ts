import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import { getJournalArticles, createJournalArticle, getArticleBySlug } from "@/lib/db/service";

export async function GET(req: NextRequest) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const articles = await getJournalArticles(false);
    return NextResponse.json({ articles });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { title, slug } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const targetSlug = (slug || title)
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await getArticleBySlug(targetSlug);
    if (existing) {
      return NextResponse.json(
        { error: `An article with slug "${targetSlug}" already exists.` },
        { status: 409 }
      );
    }

    const newArticle = await createJournalArticle({
      title,
      slug: targetSlug,
      category: body.category || "Architecture & Context",
      date: body.date || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase(),
      excerpt: body.excerpt || "",
      image: body.image || "/projects/HAVEN/1-opt.jpg",
      imagePublicId: body.imagePublicId,
      author: body.author || "Zero Studio",
      content: {
        intro: body.content?.intro || body.excerpt || "",
        paragraphs: body.content?.paragraphs || [],
        secondaryImage: body.content?.secondaryImage,
        secondaryImagePublicId: body.content?.secondaryImagePublicId,
        secondaryImageCaption: body.content?.secondaryImageCaption,
      },
      featured: body.featured ?? false,
      visible: body.visible ?? true,
      order: body.order ?? 99,
    });

    return NextResponse.json({ success: true, article: newArticle }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
