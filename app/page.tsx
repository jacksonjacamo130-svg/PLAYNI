"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Coins, ChevronRight, Clock3, LoaderCircle, Search, ShieldCheck, Sparkles, UserCircle2, Gamepad2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import BottomNav from "./components/BottomNav";

type PlayOffer = { id:string; title:string; description:string; category:string; icon:string; landingPage:string; tasks:{name:string;reward:number|null}[]; daysLeft:number|null };

export default function HomePage(){
  const [name,setName]=useState("Jugador"), [balance,setBalance]=useState("0.00"), [offers,setOffers]=useState<PlayOffer[]>([]), [loading,setLoading]=useState(true), [query,setQuery]=useState("");

  useEffect(()=>{(async()=>{
    const {data:{session}}=await supabase.auth.getSession();
    if(!session){window.location.replace("/login");return;}
    const [{data:p},{data:w}]=await Promise.all([
      supabase.from("profiles").select("full_name,display_name").eq("id",session.user.id).maybeSingle(),
      supabase.from("wallets").select("coins").eq("user_id",session.user.id).maybeSingle()
    ]);
    setName(p?.full_name?.trim().split(" ")[0]||p?.display_name||"Jugador");
    setBalance(((w?.coins??0)/1000).toFixed(2));
    try{
      const res=await fetch("/api/offers",{headers:{Authorization:"Bearer "+session.access_token}});
      const data=await res.json();
      setOffers(data.offers??[]);
    }catch{}
    setLoading(false);
  })()},[]);

  const filtered=offers.filter(o=>(o.title+" "+o.category+" "+o.description).toLowerCase().includes(query.toLowerCase()));

  return <main className="app-shell discover-page">
    <header className="topbar discover-topbar">
      <Link className="brand" href="/" aria-label="PLAYNI">
        <img className="brand-logo brand-logo-hero" src="https://raw.githubusercontent.com/jacksonjacamo130-svg/PLAYNI/main/logo-playni.png" alt="PLAYNI"/>
      </Link>
      <div className="discover-actions">
        <Link className="balance account-balance" href="/wallet"><Coins size={16}/><strong>{"$"+balance}</strong><ChevronRight size={14}/></Link>
        <Link className="profile-circle" href="/profile" aria-label="Mi perfil"><UserCircle2 size={28}/></Link>
      </div>
    </header>

    <section className="discover-welcome">
      <div>
        <span className="eyebrow"><Sparkles size={13}/> DESCUBRIR</span>
        <h1>Hola, {name} 👋</h1>
        <p>Encuentra una oferta, empieza a jugar y gana recompensas.</p>
      </div>
    </section>

    <section className="discover-offers">
      <div className="discover-heading">
        <div>
          <span className="eyebrow">OFERTAS DISPONIBLES</span>
          <h2>Juegos para ti</h2>
        </div>
        <span className="discover-count">{offers.length} disponibles</span>
      </div>

      <label className="discover-search">
        <Search size={18}/>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar juegos y ofertas"/>
      </label>

      {loading ? <div className="discover-loading"><LoaderCircle className="spin" size={25}/><span>Buscando ofertas disponibles...</span></div> :
      filtered.length ? <div className="discover-grid">{filtered.map(o=><article className="discover-card" key={o.id}>
        <div className="discover-cover">
          {o.icon?<img src={o.icon} alt=""/>:<div className="discover-cover-placeholder"><Gamepad2 size={48}/></div>}
          <span>{o.category}</span>
        </div>
        <div className="discover-card-body">
          <div className="discover-card-title">
            <h3>{o.title}</h3>
            <strong>+{o.tasks.reduce((a,t)=>a+(t.reward??0),0)} coins</strong>
          </div>
          <p>{o.description||"Completa objetivos dentro del juego para recibir recompensas."}</p>
          <div className="discover-meta"><span><Clock3 size={14}/>{o.daysLeft!=null?o.daysLeft+" días":"Tiempo limitado"}</span><span>{o.tasks.length||1} objetivos</span></div>
          <a className="discover-cta" href={o.landingPage} target="_blank" rel="noreferrer">VER OFERTA <ChevronRight size={17}/></a>
        </div>
      </article>)}</div> :
      <div className="no-real-offers discover-empty">
        <div className="no-offers-icon"><Gamepad2 size={32}/></div>
        <h2>{query ? "No encontramos esa oferta" : "Todavía no hay ofertas disponibles"}</h2>
        <p>{query ? "Prueba con otro nombre o categoría." : "Las campañas reales aparecerán aquí cuando estén disponibles para tu país y dispositivo."}</p>
        <span>No mostramos juegos falsos ni recompensas inventadas.</span>
      </div>}
    </section>

    <section className="discover-trust"><ShieldCheck size={17}/><span>Completa objetivos válidos y tus recompensas se reflejarán en tu billetera.</span></section>
    <BottomNav/>
  </main>;
}