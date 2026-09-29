import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

export async function POST() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ userId: data.user?.id ?? null });
}
