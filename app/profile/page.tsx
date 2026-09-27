"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserCircle2, ShieldCheck, LogOut, Mail, MapPin, UserRound } from "lucide-react";
import { supabase } from "../../lib/supabase";
import BottomNav from "../components/BottomNav";

const countryNames: Record<string,string> = {
  NI: "Nicaragua",
  US: "Estados Unidos",
  MX: "México",
  CR: "Costa Rica",
  HN: "Honduras",
  SV: "El Salvador",
  GT: "Guatemala",
  PA: "Panamá",
  CO: "Colombia",
  VE: "Venezuela",
  DO: "República Dominicana",
  PR: "Puerto Rico",
};

export default function ProfilePage(){
  const [name,setName]=useState("Jugador");
  const [email,setEmail]=useState("");
  const [country,setCountry]=useState("No especificado");

  useEffect(()=>{(async()=>{
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){window.location.href="/login";return;}
    setEmail(user.email??"");
    const {data}=await supabase.from("profiles").select("full_name,display_name,country_code").eq("id",user.id).maybeSingle();
    setName(data?.full_name?.trim()||data?.display_name||"Jugador");
    const code=(data?.country_code??"").toUpperCase();
    setCountry(countryNames[code]||code||"No especificado");
  })()},[]);

  async function logout(){
    await supabase.auth.signOut({scope:"local"});
    window.location.href="/login";
  }

  return <main className="app-shell profile-page">
    <header className="topbar inner-page-topbar">
      <Link className="brand" href="/">
        <img className="brand-logo" src="https://raw.githubusercontent.com/jacksonjacamo130-svg/PLAYNI/main/logo-playni.png" alt="PLAYNI"/>
      </Link>
      <div className="page-title"><UserCircle2 size={20}/><span>PERFIL</span></div>
    </header>

    <section className="profile-content">
      <div className="profile-intro">
        <span className="eyebrow">TU CUENTA</span>
        <h1>Mi perfil</h1>
        <p>Información de la cuenta con la que te registraste en PLAYNI.</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar"><UserCircle2 size={42}/></div>
        <div className="profile-status"><ShieldCheck size={15}/> CUENTA PLAYNI</div>
        <div className="profile-info-list">
          <div className="profile-info-row"><div className="profile-info-icon"><Mail size={18}/></div><div><span>Correo</span><strong>{email||"Cargando..."}</strong></div></div>
          <div className="profile-info-row"><div className="profile-info-icon"><UserRound size={18}/></div><div><span>Nombre</span><strong>{name}</strong></div></div>
          <div className="profile-info-row"><div className="profile-info-icon"><MapPin size={18}/></div><div><span>País</span><strong>{country}</strong></div></div>
        </div>
      </div>

      <button className="profile-logout" onClick={logout}><LogOut size={17}/> CERRAR SESIÓN</button>
    </section>

    <BottomNav />
  </main>;
}