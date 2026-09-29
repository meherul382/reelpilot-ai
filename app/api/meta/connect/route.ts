import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET(request: Request) {
  const appId = process.env.META_APP_ID;
  const version = process.env.META_GRAPH_VERSION || "v24.0";
  if (!appId) return NextResponse.json({ error: "META_APP_ID is not configured." }, { status: 500 });

  const redirectUri = process.env.META_REDIRECT_URI || new URL("/api/meta/callback", request.url).toString();
  const state = crypto.randomBytes(24).toString("hex");
  const store = await cookies();
  store.set("reelpilot_meta_state", state, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 600 });

  const scope = [
    "pages_show_list",
    "pages_read_engagement",
    "pages_manage_posts",
    "pages_manage_metadata",
    "publish_video"
  ].join(",");

  const url = new URL(`https://www.facebook.com/${version}/dialog/oauth`);
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", scope);

  return NextResponse.redirect(url);
}
