import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import { getProjects, createProject, getProjectBySlug } from "@/lib/db/service";

export async function GET(req: NextRequest) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const projects = await getProjects(false);
    return NextResponse.json({ projects });
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
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    const existing = await getProjectBySlug(targetSlug);
    if (existing) {
      return NextResponse.json(
        { error: `A project with slug "${targetSlug}" already exists.` },
        { status: 409 }
      );
    }

    const newProject = await createProject({
      slug: targetSlug,
      title: body.title,
      subtitle: body.subtitle || "",
      category: body.category || "Architecture",
      year: body.year || new Date().getFullYear().toString(),
      location: body.location || "",
      area: body.area || "",
      client: body.client,
      leadArchitects: body.leadArchitects || "Hafeez & Arjun",
      photography: body.photography || "",
      awards: body.awards || [],
      heroImage: body.heroImage || "/projects/HAVEN/1-opt.jpg",
      heroImagePublicId: body.heroImagePublicId,
      summary: body.summary || "",
      narrative: body.narrative || [],
      gallery: body.gallery || [],
      featured: body.featured ?? false,
      visible: body.visible ?? true,
      order: body.order ?? 99,
    });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
