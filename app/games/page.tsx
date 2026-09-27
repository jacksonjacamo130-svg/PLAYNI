"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Gamepad2, ChevronRight, Clock3, LoaderCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

type Offer = { id:string; title:string; description:string; category:string; icon:string; landingPage:string; tasks:{name:string;reward:number|null}[]; daysLeft:number|null };

export default function GamesPage(){
  const [offers,setOffers]=useState<Offer[]>([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{
    const {data:{session}}=await supabase.auth.getSession();
    if(!session){window.location.href="/login";return;}
    try{
      const res=await fetch("/api/offers",{headers:{Authorization:"Bearer "+session.access_token}});
      const data=await res.json();
      setOffers(data.offers??[]);
    }catch{}
    setLoading(false);
  })()},[]);
  return <main className="app-shell">
    <header className="topbar"><Link className="back-link" href="/"><ArrowLeft size={19}/></Link><div className="brand"><Gamepad2 size={24}/><span>JUEGOS</span></div><div className="wallet-mini">PLAYNI</div></header>
    <section className="section" style={{paddingTop:32}}>
      <div className="section-head"><div><span className="eyebrow">OFERTAS</span><h2>Juega y gana</h2></div></div>
      {loading?<div className="offers-empty"><LoaderCircle className="spin" size={24}/><span>Cargando ofertas...</span></div>:offers.length?<div className="game-grid">{offers.map(o=><article className="game-card" key={o.id}><div className="game-cover">{o.icon?<img className="game-offer-icon" src={o.icon} alt=""/>:<span className="game-icon">🎮</span>}</div><div className="game-info"><span className="tag">{o.category}</span><h3>{o.title}</h3><p><Clock3 size={14}/>{o.tasks[0]?.name||o.description||"Completa los objetivos"}</p>{o.daysLeft!=null&&<small className="offer-days">{o.daysLeft} días restantes</small>}<a className="offer-link" href={o.landingPage} target="_blank" rel="noreferrer">VER OFERTA <ChevronRight size={16}/></a></div></article>)}</div>:<div className="offers-empty"><strong>Aún no hay ofertas disponibles</strong><span>Las ofertas aparecerán aquí cuando haya campañas disponibles para tu país y dispositivo.</span></div>}
    </section>
    <nav className="bottom-nav"><Link href="/"><span>⌂</span><span>Inicio</span></Link><Link className="active" href="/games"><Gamepad2 size={21}/><span>Juegos</span></Link><Link href="/rewards"><span>🎁</span><span>Premios</span></Link><Link href="/wallet"><span>💳</span><span>Billetera</span></Link><Link href="/profile"><span>👤</span><span>Perfil</span></Link></nav>
  </main>;
}