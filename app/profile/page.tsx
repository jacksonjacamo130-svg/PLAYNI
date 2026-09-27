"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, ShieldCheck, LogOut, ChevronRight } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ProfilePage(){
  const [name,setName]=useState("Jugador");
  const [email,setEmail]=useState("");
  useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user){window.location.href="/login";return;}setEmail(user.email??"");const {data}=await supabase.from("profiles").select("full_name,display_name,country_code").eq("id",user.id).maybeSingle();setName(data?.full_name?.trim().split(" ")[0]||data?.display_name||"Jugador");})()},[]);
  async function logout(){await supabase.auth.signOut({scope:"local"});window.location.href="/login";}
  return <main className="app-shell">
    <header className="topbar"><Link className="back-link" href="/"><ArrowLeft size={19}/></Link><div className="brand"><User size={24}/><span>PERFIL</span></div><div className="wallet-mini">PLAYNI</div></header>
    <section className="section" style={{paddingTop:32}}>
      <div className="welcome-bar" style={{margin:0}}><div><span className="eyebrow">TU CUENTA</span><h2>Hola, {name} 👋</h2><p>{email}</p></div><div className="verified-pill"><ShieldCheck size={14}/> CUENTA</div></div>
      <div className="wallet-card" style={{marginTop:18}}><span className="eyebrow">CONFIGURACIÓN</span><h2>Mi perfil</h2><p className="wallet-muted">Tu información de cuenta se mantiene asociada a tu perfil PLAYNI.</p><Link className="offer-link" href="/wallet">IR A BILLETERA <ChevronRight size={16}/></Link><button className="wallet-withdraw" style={{marginTop:14}} onClick={logout}><LogOut size={17}/> CERRAR SESIÓN</button></div>
    </section>
    <nav className="bottom-nav"><Link href="/"><span>⌂</span><span>Inicio</span></Link><Link href="/games"><span>🎮</span><span>Juegos</span></Link><Link href="/rewards"><span>🎁</span><span>Premios</span></Link><Link href="/wallet"><span>💳</span><span>Billetera</span></Link><Link className="active" href="/profile"><User size={21}/><span>Perfil</span></Link></nav>
  </main>;
}