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

  // PLAYNI WEB → Offerwall API adslot 29888.
  // Offerwall API does not require exposing the publisher API key to the client.
  const adslotId = "29888";

  const params = new URLSearchParams({
    external_identifier: user.id,
    user_agent: request.headers.get("user-agent") ?? "",
    ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "",
    language: "es",
    num_offers: "30",
    offer_sorting: "ecpm",
    minimum_payout: "0"
  });

  const response = await fetch(
    `https://www.ayetstudios.com/offers/offerwall_api/${encodeURIComponent(adslotId)}?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    return NextResponse.json({ configured: true, provider: "ayet", offers: [], error: "PROVIDER_ERROR" }, { status: 502 });
  }

  const data = await response.json();
  const offers = Array.isArray(data.offers) ? data.offers.map((offer: any) => ({
    id: String(offer.id),
    title: offer.name ?? "Oferta",
    description: offer.description ?? "",
    category: offer.tags?.categories?.[0] ?? offer.category ?? "Oferta",
    icon: offer.icon_large || offer.icon || "",
    landingPage: offer.landing_page ?? "",
    platform: offer.platform ?? "unknown",
    conversionType: offer.conversion_type ?? null,
    instructions: offer.conversion_instructions ?? "",
    tasks: Array.isArray(offer.tasks) ? offer.tasks.map((task: any) => ({
      id: task.uuid ?? task.event_name ?? task.id ?? null,
      name: task.name ?? task.task_name ?? task.event_name ?? "Objetivo",
      reward: task.currency_amount ?? task.reward ?? null,
      status: task.status ?? null
    })) : [],
    offerStatus: offer.offer_status ?? "new",
    daysLeft: offer.offer_status_days_left ?? null,
    impressionUrl: offer.impression_url ?? null
  })) : [];

  return NextResponse.json({
    configured: true,
    provider: "ayet",
    currency: data.offerwall?.currency_name_plural ?? "Coins",
    offers
  });
}
