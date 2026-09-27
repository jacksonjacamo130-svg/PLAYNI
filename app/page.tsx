"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gamepad2, WalletCards, ChevronRight, Coins, Clock3, ShieldCheck, Sparkles, LoaderCircle, ListChecks } from "lucide-react";
import { supabase } from "../lib/supabase";
import BottomNav from "./components/BottomNav";

type PlayOffer = { id:string; title:string; description:string; category:string; icon:string; landingPage:string; tasks:{name:string;reward:number|null}[]; daysLeft:number|null };

export default function HomePage(){
  const [name,setName]=useState("Jugador"), [balance,setBalance]=useState("0.00"), [offers,setOffers]=useState<PlayOffer[]>([]), [loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{const {data:{session}}=await supabase.auth.getSession();if(!session){window.location.replace("/login");return;}const [{data:p},{data:w}]=await Promise.all([supabase.from("profiles").select("full_name,display_name").eq("id",session.user.id).maybeSingle(),supabase.from("wallets").select("coins").eq("user_id",session.user.id).maybeSingle()]);setName(p?.full_name?.trim().split(" ")[0]||p?.display_name||"Jugador");setBalance(((w?.coins??0)/1000).toFixed(2));try{const res=await fetch("/api/offers",{headers:{Authorization:"Bearer "+session.access_token}});const data=await res.json();setOffers(data.offers??[]);}catch{}setLoading(false);})()},[]);
  return <main className="app-shell home-simple">
    <header className="topbar"><Link className="brand" href="/"><img className="brand-logo" src="https://raw.githubusercontent.com/jacksonjacamo130-svg/PLAYNI/main/logo-playni.png" alt="PLAYNI"/></Link><Link className="balance account-balance" href="/wallet"><Coins size={16}/><strong>{"$"+balance}</strong><ChevronRight size={14}/></Link></header>
    <section className="home-welcome"><div><span className="eyebrow"><Sparkles size={13}/> PLAYNI</span><h1>Hola, {name} 👋</h1><p>Elige una oferta y empieza a ganar.</p></div><Link className="home-profile" href="/profile">Mi perfil</Link></section>
    <section className="earn-hero"><div><span className="eyebrow">TU SALDO</span><strong>{"$"+balance}</strong><span>Disponible en tu billetera</span></div><Link href="/games" className="primary-btn">GANAR AHORA <ChevronRight size={18}/></Link></section>
    <section className="home-games-first"><div className="simple-head"><div><span className="eyebrow"><Sparkles size={13}/> PARA TI</span><h2>Juegos que puedes empezar</h2></div><Link href="/games">Ver todos <ChevronRight size={15}/></Link></div>{loading?<div className="simple-empty"><LoaderCircle className="spin" size={22}/><span>Buscando juegos...</span></div>:offers.length?<div className="home-game-strip">{offers.slice(0,3).map(o=><article className="home-game-card" key={o.id}><div className="home-game-image">{o.icon?<img src={o.icon} alt=""/>:<Gamepad2 size={42}/>}<span>{o.category}</span></div><div className="home-game-info"><h3>{o.title}</h3><p>{o.tasks.length||1} objetivos · {o.daysLeft!=null?o.daysLeft+" días":"tiempo limitado"}</p><a href={o.landingPage} target="_blank" rel="noreferrer">JUGAR <ChevronRight size={15}/></a></div></article>)}</div>:<div className="no-real-offers home-no-offers"><div className="no-offers-icon"><Gamepad2 size={28}/></div><h3>Tus juegos aparecerán aquí</h3><p>Estamos conectando las campañas reales disponibles para tu país y dispositivo.</p><Link href="/games">VER OFERTAS</Link></div>}</section>
    <section className="simple-section"><div className="simple-head"><div><span className="eyebrow">TU PROGRESO</span><h2>Mis tareas</h2></div><Link href="/tasks">Ver mis tareas <ChevronRight size={15}/></Link></div><div className="continue-card"><div className="continue-icon"><ListChecks size={23}/></div><div><strong>Continúa donde quedaste</strong><p>Las ofertas que empieces aparecerán aquí con tus objetivos y progreso.</p></div><ChevronRight size={20}/></div></section>
    <section className="how-simple"><span className="eyebrow">MUY FÁCIL</span><h2>¿Cómo ganas?</h2><div className="mini-steps"><div><b>1</b><span>Elige</span></div><div><b>2</b><span>Juega</span></div><div><b>3</b><span>Completa</span></div><div><b>4</b><span>Retira</span></div></div><p><ShieldCheck size={15}/> Cada objetivo validado suma a tu saldo.</p></section>
    <BottomNav />
  </main>;
}