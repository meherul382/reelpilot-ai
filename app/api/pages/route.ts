import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ pages: [] });

  const { data, error } = await supabase
    .from("facebook_pages")
    .select("id,page_id,page_name")
    .order("page_name");

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ pages: data ?? [] });
}
