import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://ftcmijoklkmyrqqqlabs.supabase.co";
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_SqM8MLVo76vprAalGIq4_w_Oyj52mn7";

type StartBody = {
  provider?: string;
  externalOfferId?: string;
  title?: string;
  description?: string;
  iconUrl?: string;
  landingUrl?: string;
  category?: string;
  platform?: string;
  rewardCoins?: number;
  daysLeft?: number | null;
  tasks?: { id?: string | null; name?: string; reward?: number | null }[];
};

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  }

  const userClient = createClient(url, publishableKey, {
    global: { headers: { Authorization: auth } },
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "INVALID_SESSION" }, { status: 401 });
  }

  let body: StartBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const provider = String(body.provider ?? "").trim();
  const externalOfferId = String(body.externalOfferId ?? "").trim();
  const title = String(body.title ?? "Oferta").trim();
  const landingUrl = String(body.landingUrl ?? "").trim();

  if (!provider) return NextResponse.json({ error: "PROVIDER_REQUIRED" }, { status: 400 });
  if (!externalOfferId || !landingUrl) {
    return NextResponse.json({ error: "OFFER_DATA_REQUIRED" }, { status: 400 });
  }

  const { data: existing, error: existingError } = await userClient
    .from("user_offers")
    .select("id,status,deadline_at")
    .eq("user_id", user.id)
    .eq("provider", provider)
    .eq("external_offer_id", externalOfferId)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: "LOOKUP_FAILED" }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json({ ok: true, alreadyStarted: true, userOfferId: existing.id });
  }

  const daysLeft = typeof body.daysLeft === "number" && body.daysLeft > 0 ? Math.ceil(body.daysLeft) : null;
  const deadlineAt = daysLeft ? new Date(Date.now() + daysLeft * 86400000).toISOString() : null;
  const tasks = Array.isArray(body.tasks) ? body.tasks : [];
  const rewardCoins = Number.isFinite(body.rewardCoins) ? Math.max(0, Math.round(Number(body.rewardCoins))) : 0;

  const { data: started, error: startError } = await userClient
    .from("user_offers")
    .insert({
      user_id: user.id,
      provider,
      external_offer_id: externalOfferId,
      title,
      description: String(body.description ?? ""),
      icon_url: body.iconUrl ? String(body.iconUrl) : null,
      landing_url: landingUrl,
      category: String(body.category ?? "Oferta"),
      platform: String(body.platform ?? "unknown"),
      reward_coins: rewardCoins,
      days_limit: daysLeft,
      deadline_at: deadlineAt
    })
    .select("id")
    .single();

  if (startError || !started) {
    if (startError?.code === "23505") {
      const { data: raceExisting } = await userClient
        .from("user_offers")
        .select("id")
        .eq("user_id", user.id)
        .eq("provider", provider)
        .eq("external_offer_id", externalOfferId)
        .maybeSingle();

      if (raceExisting) return NextResponse.json({ ok: true, alreadyStarted: true, userOfferId: raceExisting.id });
    }

    return NextResponse.json({ error: "START_FAILED" }, { status: 500 });
  }

  const cleanTasks = tasks
    .map(task => ({
      user_offer_id: started.id,
      external_task_id: task.id ? String(task.id) : null,
      name: String(task.name ?? "Objetivo").trim(),
      reward_coins: task.reward == null ? null : Math.max(0, Math.round(Number(task.reward)))
    }))
    .filter(task => task.name);

  if (cleanTasks.length) {
    const { error: taskError } = await userClient.from("user_offer_tasks").insert(cleanTasks);
    if (taskError) {
      await userClient.from("user_offers").delete().eq("id", started.id);
      return NextResponse.json({ error: "TASKS_SAVE_FAILED" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, alreadyStarted: false, userOfferId: started.id });
}
