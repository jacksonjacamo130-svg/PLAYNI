"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gamepad2, Clock3, LoaderCircle, Search, Sparkles } from "lucide-react";
import { supabase } from "../../lib/supabase";
import BottomNav from "../components/BottomNav";
import StartOfferButton from "../components/StartOfferButton";

type Offer={
  id:string;title:string;description:string;category:string;icon:string;landingPage:string;
  tasks:{id?:string|null;name:string;reward:number|null}[];daysLeft:number|null;platform?:string
};

export default function GamesPage(){
 const [offers,setOffers]=useState<Offer[]>([]),[loading,setLoading]=useState(true),[query,setQuery]=useState("");
 useEffect(()=>{(async()=>{
   const {data:{session}}=await supabase.auth.getSession();
   if(!session){window.location.replace("/login");return;}
   try{
     const res=await fetch("/api/offers",{headers:{Authorization:"Bearer "+session.access_token}});
     const data=await res.json();setOffers(data.offers??[]);
   }catch{}
   setLoading(false)
 })()},[]);
 const filtered=offers.filter(o=>(o.title+" "+o.category).toLowerCase().includes(query.toLowerCase()));
 return <main className="app-shell games-premium">
  <header className="topbar"><Link className="brand" href="/"><img className="brand-logo" src="https://raw.githubusercontent.com/jacksonjacamo130-svg/PLAYNI/main/logo-playni.png" alt="PLAYNI"/></Link><div className="games-title"><Gamepad2 size={18}/><span>GANAR</span></div></header>
  <section className="games-hero"><div><span className="eyebrow"><Sparkles size={13}/> PLAYNI GAMES</span><h1>Juega. Completa.<br/><strong>Gana.</strong></h1><p>Elige una oferta, completa sus objetivos y recibe tus recompensas.</p></div></section>
  <section className="games-content">
   <div className="games-toolbar"><div><span className="eyebrow">DISPONIBLES PARA TI</span><h2>Juegos y ofertas</h2></div><label className="games-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar juego"/></label></div>
   {loading?<div className="games-loading"><LoaderCircle className="spin" size={28}/><span>Buscando ofertas disponibles...</span></div>:filtered.length?<div className="premium-game-grid">{filtered.map(o=><article className="premium-game" key={o.id}><div className="premium-cover">{o.icon?<img src={o.icon} alt=""/>:<div className="cover-placeholder"><Gamepad2 size={48}/></div>}<span className="premium-badge">{o.category}</span></div><div className="premium-body"><div className="premium-title"><h3>{o.title}</h3><span className="premium-earn">{o.tasks.filter(t=>t.reward!=null).reduce((a,t)=>a+(t.reward??0),0)>0?("+"+o.tasks.reduce((a,t)=>a+(t.reward??0),0)+" coins"):"RECOMPENSAS"}</span></div><p>{o.description||"Completa objetivos dentro del juego para recibir recompensas."}</p><div className="premium-meta"><span><Clock3 size={14}/>{o.daysLeft!=null?o.daysLeft+" días":"Tiempo limitado"}</span><span>{o.tasks.length||1} objetivos</span></div><StartOfferButton
  offerId={o.id}
  title={o.title}
  description={o.description}
  iconUrl={o.icon}
  landingUrl={o.landingPage}
  category={o.category}
  platform={o.platform}
  rewardCoins={o.tasks.reduce((a,t)=>a+(t.reward??0),0)}
  daysLeft={o.daysLeft}
  tasks={o.tasks}
  className="premium-cta"
  label="EMPEZAR A JUGAR"
 /></div></article>)}</div>:<div className="no-real-offers"><div className="no-offers-icon"><Gamepad2 size={34}/></div><h2>Estamos preparando tus juegos</h2><p>Las ofertas reales aparecerán aquí cuando haya campañas disponibles para Nicaragua y tu dispositivo.</p><span>No mostramos juegos falsos ni recompensas inventadas.</span></div>}
  </section>
  <BottomNav/>
 </main>;
}
