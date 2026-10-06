import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const authResult = await authenticateAdmin(email, password);
    if (!authResult.success || !authResult.token) {
      return NextResponse.json(
        { error: authResult.error || "Invalid email or password" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({
      success: true,
      user: { email, role: "admin" },
    });

    setSessionCookie(res, authResult.token);
    return res;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Authentication error" },
      { status: 500 }
    );
  }
}
