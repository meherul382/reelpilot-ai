import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (data.user) return NextResponse.json({ userId: data.user.id });

  const result = await supabase.auth.signInAnonymously();
  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 400 });
  return NextResponse.json({ userId: result.data.user?.id ?? null });
}
