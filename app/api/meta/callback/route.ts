import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) return NextResponse.redirect(new URL("/?facebook=denied", request.url));

  const store = await cookies();
  const savedState = store.get("reelpilot_meta_state")?.value;
  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(new URL("/?facebook=invalid_state", request.url));
  }
  store.delete("reelpilot_meta_state");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/?facebook=session_required", request.url));

  const appId = process.env.META_APP_ID!;
  const appSecret = process.env.META_APP_SECRET!;
  const version = process.env.META_GRAPH_VERSION;
  const redirectUri = process.env.META_REDIRECT_URI || new URL("/api/meta/callback", request.url).toString();

  const tokenUrl = new URL(`https://graph.facebook.com/${version}/oauth/access_token`);
  tokenUrl.searchParams.set("client_id", appId);
  tokenUrl.searchParams.set("client_secret", appSecret);
  tokenUrl.searchParams.set("redirect_uri", redirectUri);
  tokenUrl.searchParams.set("code", code);

  const tokenResponse = await fetch(tokenUrl);
  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenData.access_token) {
    return NextResponse.redirect(new URL("/?facebook=token_error", request.url));
  }

  const accessToken = tokenData.access_token as string;
  const meUrl = new URL(`https://graph.facebook.com/${version}/me`);
  meUrl.searchParams.set("fields", "id");
  meUrl.searchParams.set("access_token", accessToken);
  const meResponse = await fetch(meUrl);
  const meData = await meResponse.json();
  if (!meResponse.ok || !meData.id) {
    return NextResponse.redirect(new URL("/?facebook=identity_error", request.url));
  }

  const pagesUrl = new URL(`https://graph.facebook.com/${version}/me/accounts`);
  pagesUrl.searchParams.set("fields", "id,name,access_token");
  pagesUrl.searchParams.set("access_token", accessToken);

  const pagesResponse = await fetch(pagesUrl);
  const pagesData = await pagesResponse.json();
  if (!pagesResponse.ok) {
    return NextResponse.redirect(new URL("/?facebook=pages_error", request.url));
  }

  const admin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  await admin.from("profiles").upsert({ id: user.id });
  const { data: connection, error: connectionError } = await admin
    .from("facebook_connections")
    .insert({ user_id: user.id, meta_user_id: meData.id, token_expires_at: tokenData.expires_in ? new Date(Date.now() + Number(tokenData.expires_in) * 1000).toISOString() : null })
    .select("id")
    .single();

  if (connectionError || !connection) {
    return NextResponse.redirect(new URL("/?facebook=save_error", request.url));
  }

  await admin.from("facebook_connection_secrets").upsert({
    connection_id: connection.id,
    access_token: accessToken
  });

  for (const page of pagesData.data || []) {
    const { data: savedPage } = await admin
      .from("facebook_pages")
      .upsert({
        user_id: user.id,
        connection_id: connection.id,
        page_id: page.id,
        page_name: page.name
      }, { onConflict: "user_id,page_id" })
      .select("id")
      .single();

    if (savedPage?.id && page.access_token) {
      await admin.from("facebook_page_secrets").upsert({
        page_id: savedPage.id,
        page_access_token: page.access_token
      });
    }
  }

  return NextResponse.redirect(new URL("/?facebook=connected", request.url));
}
