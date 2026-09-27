"use client";

import { useState } from "react";
import { ChevronRight, LoaderCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

type Task = { id?: string | null; name: string; reward: number | null };

type Props = {
  provider?: string;
  offerId: string;
  title: string;
  description?: string;
  iconUrl?: string;
  landingUrl: string;
  category?: string;
  platform?: string;
  rewardCoins?: number;
  daysLeft?: number | null;
  tasks: Task[];
  className?: string;
  label?: string;
};

export default function StartOfferButton({
  provider = "ayet",
  offerId,
  title,
  description = "",
  iconUrl = "",
  landingUrl,
  category = "Oferta",
  platform = "unknown",
  rewardCoins = 0,
  daysLeft = null,
  tasks,
  className = "discover-cta",
  label = "EMPEZAR A JUGAR"
}: Props) {
  const [starting, setStarting] = useState(false);

  async function startOffer() {
    if (starting) return;
    setStarting(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch("/api/offers/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + session.access_token
        },
        body: JSON.stringify({
          provider,
          externalOfferId: offerId,
          title,
          description,
          iconUrl,
          landingUrl,
          category,
          platform,
          rewardCoins,
          daysLeft,
          tasks
        })
      });

      if (!response.ok) {
        throw new Error("start_failed");
      }

      window.location.href = landingUrl;
    } catch {
      setStarting(false);
      window.alert("No pudimos registrar esta oferta. Inténtalo de nuevo.");
    }
  }

  return (
    <button type="button" className={className} onClick={startOffer} disabled={starting}>
      {starting ? <><LoaderCircle size={17} className="spin" /> INICIANDO...</> : <>{label} <ChevronRight size={17} /></>}
    </button>
  );
}
