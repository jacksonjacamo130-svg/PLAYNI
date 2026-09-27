"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gamepad2, Gift, Home, User, WalletCards, ChevronRight, Coins, Clock3, ShieldCheck, Sparkles, LoaderCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

type PlayOffer = {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  landingPage: string;
  platform: string;
  conversionType: string | null;
  tasks: { id: string | null; name: string; reward: number | null; status: string | null }[];
  offerStatus: string;
  daysLeft: number | null;
  impressionUrl: string | null;
};



export default function HomePage() {
  const [profile, setProfile] = useState<{full_name: string | null; display_name: string | null; country_code: string; phone_verified: boolean} | null>(null);
  const [wallet, setWallet] = useState<{coins: number; lifetime_earned: number}>({ coins: 0, lifetime_earned: 0 });
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<PlayOffer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadAccount() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.replace("/login"); return; }
      const [{ data: profileData }, { data: walletData }] = await Promise.all([
        supabase.from("profiles").select("full_name,display_name,country_code,phone_verified").eq("id", user.id).maybeSingle(),
        supabase.from("wallets").select("coins,lifetime_earned").eq("user_id", user.id).maybeSingle()
      ]);
      if (mounted) {
        setProfile(profileData);
        setWallet(walletData ?? { coins: 0, lifetime_earned: 0 });
        setLoading(false);
      }
    }
    loadAccount();
    return () => { mounted = false; };
  }, []);

  const firstName = profile?.full_name?.trim().split(" ")[0] || profile?.display_name || "Jugador";
  const balance = (wallet.coins / 1000).toFixed(2);

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="PLAYNI inicio">
          <img className="brand-logo" src="https://raw.githubusercontent.com/jacksonjacamo130-svg/PLAYNI/main/logo-playni.png" alt="PLAYNI" />
        </Link>
        {loading ? (
  <div className="balance"><LoaderCircle size={16} className="spin" /></div>
) : profile ? (
  <Link className="balance account-balance" href="/wallet" aria-label="Abrir billetera"><Coins size={17} /><strong>${balance}</strong><ChevronRight size={14} /></Link>
) : (
  <a className="balance" href="/login" aria-label="Iniciar sesión"><Coins size={17} /><strong>INICIAR SESIÓN</strong></a>
)}
      </header>

      {profile && <section className="welcome-bar" id="cuenta"><div><span className="eyebrow">TU CUENTA</span><h2>Hola, {firstName} 👋</h2><p>Tu saldo y tus ganancias se actualizan desde tu cuenta PLAYNI.</p></div><div className="verified-pill">✓ TELÉFONO VERIFICADO</div></section>}

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={14} /> GANA JUGANDO</span>
          <h1>Tu próxima<br /><span>recompensa</span><br />empieza aquí.</h1>
          <p>Elige un juego, completa objetivos y mira cómo tus ganancias aumentan paso a paso.</p>
          <div className="hero-actions">
            <Link className="primary-btn" href={profile ? "/games" : "/login"}>{profile ? "VER OFERTAS" : "EMPEZAR A GANAR"} <ChevronRight size={18} /></Link>
            <span className="trust"><ShieldCheck size={15} /> Sin costo para empezar</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-glow" />
          <div className="phone">
            <div className="phone-top"><span>PLAYNI</span><Coins size={15} /></div>
            <div className="phone-balance">${balance}</div>
            <div className="phone-card"><span>🎮</span><div><b>Juega y gana</b><small>Completa objetivos</small></div></div>
            <div className="phone-card"><span>🟡</span><div><b>Recompensas</b><small>Retira cuando cumplas</small></div></div>
          </div>
          <div className="coin coin-a">₱</div><div className="coin coin-b">★</div><div className="coin coin-c">$</div>
        </div>
      </section>

      <section className="quick-stats">
        <div><span>💰</span><b>Saldo</b><strong>${balance}</strong></div>
        <div><span>🎮</span><b>Jugando</b><strong>0 ofertas</strong></div>
        <div><span>🎁</span><b>Ganado</b><strong>${(wallet.lifetime_earned / 1000).toFixed(2)}</strong></div>
      </section>

      <section className="section" id="ofertas">
        <div className="section-head">
          <div><span className="eyebrow">PARA TI</span><h2>Empieza a ganar</h2></div>
          <Link href="/games">Ver todas <ChevronRight size={16} /></Link>
        </div>
        <div className="game-grid">
          {offersLoading ? (
            <div className="offers-empty">Cargando ofertas reales disponibles para tu cuenta…</div>
          ) : offers.length ? (
            offers.map((offer) => (
              <article className="game-card" key={offer.id}>
                <div className="game-cover">
                  {offer.icon ? <img className="game-offer-icon" src={offer.icon} alt="" /> : <span className="game-icon">🎮</span>}
                  {offer.tasks[0]?.reward != null && <span className="offer-badge">RECOMPENSA DISPONIBLE</span>}
                </div>
                <div className="game-info">
                  <span className="tag">{offer.category}</span>
                  <h3>{offer.title}</h3>
                  <p><Clock3 size={14} /> {offer.tasks[0]?.name || "Completa los objetivos indicados"}</p>
                  {offer.daysLeft != null && <small className="offer-days">Tiempo restante: {offer.daysLeft} días</small>}
                  <a className="offer-link" href={offer.landingPage} target="_blank" rel="noreferrer">VER OFERTA <ChevronRight size={16} /></a>
                </div>
              </article>
            ))
          ) : (
            <div className="offers-empty">
              <strong>Estamos preparando tus ofertas</strong>
              <span>Las ofertas de juegos aparecerán aquí cuando el proveedor esté conectado y haya campañas disponibles para tu país y dispositivo.</span>
            </div>
          )}
        </div>
      </section>

      <section className="how">
        <div className="how-head"><span className="eyebrow">MUY FÁCIL</span><h2>Así funciona</h2></div>
        <div className="steps">
          <div><span>01</span><h3>Elige</h3><p>Encuentra una oferta que te interese.</p></div>
          <div><span>02</span><h3>Juega</h3><p>Instala desde PLAYNI y completa sus objetivos.</p></div>
          <div><span>03</span><h3>Gana</h3><p>Tu recompensa aparece cuando el objetivo es validado.</p></div>
          <div><span>04</span><h3>Retira</h3><p>Solicita tu recompensa desde tu billetera.</p></div>
        </div>
      </section>

      <section className="daily" id="bono">
        <div className="daily-icon">🎁</div>
        <div><strong>Bono diario</strong><p>Vuelve cada día para descubrir nuevas oportunidades.</p></div>
        <Link className="daily-button" href="/games">VER OFERTAS</Link>
      </section>

      <nav className="bottom-nav">
        <a className="active" href="/"><Home size={21} /><span>Inicio</span></a>
        <a href="#ofertas"><Gamepad2 size={21} /><span>Juegos</span></a>
        <a href="#bono"><Gift size={21} /><span>Premios</span></a>
        <a href="/wallet"><WalletCards size={21} /><span>Billetera</span></a>
        <a href={profile ? "#cuenta" : "/login"}><User size={21} /><span>Perfil</span></a>
      </nav>
    </main>
  );
}