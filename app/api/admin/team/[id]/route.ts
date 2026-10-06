import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth";
import { updateTeamMember, deleteTeamMember, getTeamMembers } from "@/lib/db/service";
import { deleteImage } from "@/lib/cloudinary";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await updateTeamMember(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, member: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const authErr = await requireApiAuth(req);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const all = await getTeamMembers(false);
    const existing = all.find((m) => m.id === id);

    if (existing?.imagePublicId) {
      await deleteImage(existing.imagePublicId);
    }

    const success = await deleteTeamMember(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
