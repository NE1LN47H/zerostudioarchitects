import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getAdminUserByEmail } from "./db/service";
import bcrypt from "bcryptjs";

const AUTH_SECRET = process.env.AUTH_SECRET || "zerostudio_auth_secret_key_change_in_production_min_32_chars";
const encodedKey = new TextEncoder().encode(AUTH_SECRET);
const COOKIE_NAME = "zerostudio_admin_token";

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function authenticateAdmin(
  email: string,
  plainPassword: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  const user = await getAdminUserByEmail(email);
  if (!user) {
    return { success: false, error: "Invalid credentials" };
  }

  const isValid = await bcrypt.compare(plainPassword, user.passwordHash);
  if (!isValid) {
    return { success: false, error: "Invalid credentials" };
  }

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { success: true, token };
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Validates request authentication for API handlers.
 * Returns null if authorized, or a 401 NextResponse if unauthorized.
 */
export async function requireApiAuth(req: NextRequest): Promise<NextResponse | null> {
  // Check cookie or Authorization Bearer header
  const token =
    req.cookies.get(COOKIE_NAME)?.value ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized or session expired" }, { status: 401 });
  }

  return null;
}
