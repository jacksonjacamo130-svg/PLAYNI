"use client";

import Link from "next/link";
import { ArrowLeft, Gift, CheckCircle2, Sparkles } from "lucide-react";
import BottomNav from "../components/BottomNav";

export default function RewardsPage(){
  return <main className="app-shell">
    <header className="topbar"><Link className="back-link" href="/"><ArrowLeft size={19}/></Link><div className="brand"><Gift size={24}/><span>PREMIOS</span></div><div className="wallet-mini">🎁</div></header>
    <section className="section" style={{paddingTop:32}}>
      <div className="section-head"><div><span className="eyebrow">RECOMPENSAS</span><h2>Premios de PLAYNI</h2></div></div>
      <div className="daily" style={{marginTop:20}}><div className="daily-icon">🎁</div><div><strong>Bono diario</strong><p>Estamos preparando el sistema de bonos diarios y rachas.</p></div></div>
      <div className="offers-empty" style={{marginTop:18}}><Sparkles size={28}/><strong>Próximamente</strong><span>Aquí aparecerán tus bonos, promociones y recompensas especiales.</span><CheckCircle2 size={20}/></div>
    </section>
    <BottomNav />
  </main>;
}