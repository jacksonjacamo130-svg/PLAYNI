"use client";

import { useEffect, useState } from "react";
import { Gamepad2, Gift, Home, User, WalletCards, ChevronRight, Coins, Clock3, ShieldCheck, Sparkles, LogOut, LoaderCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

const offers = [
  { title: "MONOPOLY GO!", category: "Tablero", reward: "$12.40", goal: "Alcanza el nivel 10", icon: "🎲" },
  { title: "Coin Master", category: "Estrategia", reward: "$9.80", goal: "Completa la aldea 5", icon: "🪙" },
  { title: "Royal Match", category: "Puzzle", reward: "$8.50", goal: "Completa 100 niveles", icon: "👑" },
  { title: "Domino Dreams", category: "Casual", reward: "$7.20", goal: "Alcanza el nivel 15", icon: "🁫" },
  { title: "Travel Town", category: "Merge", reward: "$11.60", goal: "Llega al nivel 20", icon: "🏝️" },
  { title: "Dice Dreams", category: "Estrategia", reward: "$10.30", goal: "Completa 5 aldeas", icon: "🎲" },
];

export default function HomePage() {
  const [profile, setProfile] = useState<{full_name: string | null; display_name: string | null; country_code: string; phone_verified: boolean} | null>(null);
  const [wallet, setWallet] = useState<{coins: number; lifetime_earned: number}>({ coins: 0, lifetime_earned: 0 });
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadAccount() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { if (mounted) setLoading(false); return; }
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

  async function signOut() {
    setSigningOut(true);
    await supabase.auth.signOut({ scope: "local" });
    window.location.href = "/";
  }

  const firstName = profile?.full_name?.trim().split(" ")[0] || profile?.display_name || "Jugador";
  const balance = (wallet.coins / 1000).toFixed(2);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img src="https://raw.githubusercontent.com/jacksonjacamo130-svg/PLAYNI/main/logo-playni.png" alt="PLAYNI" width={42} height={42} />
          <span>PLAYNI</span>
        </div>
        {loading ? (
  <div className="balance"><LoaderCircle size={16} className="spin" /></div>
) : profile ? (
  <button className="balance account-balance" onClick={signOut} disabled={signingOut}><Coins size={17} /><strong>${balance}</strong><LogOut size={14} /></button>
) : (
  <a className="balance" href="/login" aria-label="Iniciar sesión"><Coins size={17} /><strong>INICIAR SESIÓN</strong></a>
)}
      </header>

      {profile && <section className="welcome-bar"><div><span className="eyebrow">TU CUENTA</span><h2>Hola, {firstName} 👋</h2><p>Tu saldo y tus ganancias se actualizan desde tu cuenta PLAYNI.</p></div><div className="verified-pill">✓ TELÉFONO VERIFICADO</div></section>}

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={14} /> GANA JUGANDO</span>
          <h1>Tu próxima<br /><span>recompensa</span><br />empieza aquí.</h1>
          <p>Elige un juego, completa objetivos y mira cómo tus ganancias aumentan paso a paso.</p>
          <div className="hero-actions">
            <a className="primary-btn" href={profile ? "#ofertas" : "/login"}>{profile ? "VER OFERTAS" : "EMPEZAR A GANAR" <ChevronRight size={18} /></a>
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
        <div><span>🎁</span><b>Ganado</b><strong>${balance}</strong></div>
      </section>

      <section className="section" id="ofertas">
        <div className="section-head">
          <div><span className="eyebrow">PARA TI</span><h2>Empieza a ganar</h2></div>
          <a href="#">Ver todas <ChevronRight size={16} /></a>
        </div>
        <div className="game-grid">
          {offers.map((offer) => (
            <article className="game-card" key={offer.title}>
              <div className="game-cover">
                <span className="game-icon">{offer.icon}</span>
                <span className="offer-badge">HASTA {offer.reward}</span>
              </div>
              <div className="game-info">
                <span className="tag">{offer.category}</span>
                <h3>{offer.title}</h3>
                <p><Clock3 size={14} /> {offer.goal}</p>
                <button>VER OFERTA <ChevronRight size={16} /></button>
              </div>
            </article>
          ))}
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

      <section className="daily">
        <div className="daily-icon">🎁</div>
        <div><strong>Bono diario</strong><p>Vuelve cada día para descubrir nuevas oportunidades.</p></div>
        <button>VER BONO</button>
      </section>

      <nav className="bottom-nav">
        <a className="active" href="/"><Home size={21} /><span>Inicio</span></a>
        <a href="#ofertas"><Gamepad2 size={21} /><span>Juegos</span></a>
        <a><Gift size={21} /><span>Premios</span></a>
        <a><WalletCards size={21} /><span>Billetera</span></a>
        <a><User size={21} /><span>Perfil</span></a>
      </nav>
    </main>
  );
}