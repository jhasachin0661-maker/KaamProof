import { NextResponse } from "next/server";
import { assertSameOrigin, clearSessionCookie, revokeSession } from "@/lib/auth";
import { errorResponse } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await revokeSession(request);
    const res = NextResponse.json({ success: true });
    clearSessionCookie(res);
    return res;
  } catch (e) {
    return errorResponse(e, "logout");
  }
}
