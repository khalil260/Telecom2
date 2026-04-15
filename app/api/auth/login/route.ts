import { NextResponse } from "next/server";
import {
  getAuthCookieName,
  getAuthCookieValue,
  getDashboardPassword,
  getDashboardUsername,
} from "@/lib/auth";

interface LoginBody {
  username?: string;
  password?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json().catch(() => ({}))) as LoginBody;

  if (!body.username || !body.password) {
    return NextResponse.json(
      { error: "username and password are required" },
      { status: 400 },
    );
  }

  const valid =
    body.username.toLowerCase() === getDashboardUsername().toLowerCase() &&
    body.password === getDashboardPassword();

  if (!valid) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: getAuthCookieName(),
    value: getAuthCookieValue(),
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
