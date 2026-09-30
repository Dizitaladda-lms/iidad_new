import { NextResponse } from "next/server";
import {
  clearAdminSessionCookie,
  ensureAdminApi,
  setAdminSessionCookie,
  validateAdminCredentials,
} from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { recordAudit } from "@/lib/audit";
import { getClientIp } from "@/lib/request-info";

const LOGIN_WINDOW_MS = 60_000;
const LOGIN_ATTEMPT_LIMIT = 5;

export async function POST(request) {
  try {
    const ip = await getClientIp(request);
    const isAllowed = rateLimit({
      key: `admin-login:${ip}`,
      limit: LOGIN_ATTEMPT_LIMIT,
      windowMs: LOGIN_WINDOW_MS,
    });

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again shortly." },
        { status: 429 }
      );
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { username, password } = payload || {};
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    let isValid = false;
    try {
      isValid = validateAdminCredentials(username, password);
    } catch (policyError) {
      console.error("Admin credentials policy error:", policyError.message);
      return NextResponse.json(
        { error: policyError.message || "Server authentication configuration error" },
        { status: 500 }
      );
    }

    if (!isValid) {
      await recordAudit("admin.login.failed", {
        actor: username,
        ip,
      });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    setAdminSessionCookie(response);
    await recordAudit("admin.login.success", {
      actor: username,
      ip,
    });
    return response;
  } catch (error) {
    console.error("POST /api/admin/session failed:", error);
    return NextResponse.json({ error: "Unable to complete login at this time" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await ensureAdminApi(request, { requireCsrf: true });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    clearAdminSessionCookie(response);
    const ip = await getClientIp(request);
    await recordAudit("admin.logout", {
      actor: session.sub,
      ip,
    });
    return response;
  } catch (error) {
    console.error("DELETE /api/admin/session failed:", error);
    return NextResponse.json({ error: "Unable to logout" }, { status: 500 });
  }
}
