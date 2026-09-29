import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://ftcmijoklkmyrqqqlabs.supabase.co";
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_SqM8MLVo76vprAalGIq4_w_Oyj52mn7";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ configured: false, offers: [], error: "AUTH_REQUIRED" }, { status: 401 });
  }

  const userClient = createClient(url, publishableKey, {
    global: { headers: { Authorization: auth } },
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ configured: false, offers: [], error: "INVALID_SESSION" }, { status: 401 });
  }

  return NextResponse.json({ configured: false, offers: [] });
}
