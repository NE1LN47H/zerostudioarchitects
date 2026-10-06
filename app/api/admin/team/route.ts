import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import { getTeamMembers, createTeamMember } from "@/lib/db/service";

export async function GET(req: NextRequest) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const team = await getTeamMembers(false);
    return NextResponse.json({ team });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { name, role } = body;

    if (!name || !role) {
      return NextResponse.json({ error: "Name and role are required" }, { status: 400 });
    }

    const member = await createTeamMember({
      name,
      role,
      image: body.image,
      imagePublicId: body.imagePublicId,
      bio: body.bio || "",
      order: body.order ?? 99,
      visible: body.visible ?? true,
    });

    return NextResponse.json({ success: true, member }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
