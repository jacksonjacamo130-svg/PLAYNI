"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserCircle2, ShieldCheck, LogOut, Mail, MapPin, UserRound, Bell, KeyRound, Settings2, ChevronRight, CalendarDays, Badge, VenusAndMars } from "lucide-react";
import { supabase } from "../../lib/supabase";
import BottomNav from "../components/BottomNav";

const countryNames: Record<string,string> = {
  NI: "Nicaragua", US: "Estados Unidos", MX: "México", CR: "Costa Rica", HN: "Honduras",
  SV: "El Salvador", GT: "Guatemala", PA: "Panamá", CO: "Colombia", VE: "Venezuela",
  DO: "República Dominicana", PR: "Puerto Rico",
};

export default function ProfilePage(){
  const [name,setName]=useState("Jugador");
  const [email,setEmail]=useState("");
  const [country,setCountry]=useState("No especificado");
  const [birthDate,setBirthDate]=useState("No especificada");
  const [gender,setGender]=useState("No especificado");
  const [userId,setUserId]=useState("");

  useEffect(()=>{(async()=>{
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){window.location.href="/login";return;}
    setEmail(user.email??"");
    setUserId(user.id);
    const {data}=await supabase.from("profiles").select("full_name,display_name,country_code,birth_date,gender").eq("id",user.id).maybeSingle();
    setName(data?.full_name?.trim()||data?.display_name||"Jugador");
    const code=(data?.country_code??"").toUpperCase();
    setCountry(countryNames[code]||code||"No especificado");
    if(data?.birth_date){
      const parts=String(data.birth_date).split("-");
      setBirthDate(parts[2]+"/"+parts[1]+"/"+parts[0]);
    }
    const g=String(data?.gender??"").toLowerCase();
    const genderLabel=g==="male"||g==="hombre"?"Hombre":g==="female"||g==="mujer"?"Mujer":g==="other"||g==="otro"?"Otro":"No especificado";
    setGender(genderLabel);
  })()},[]);

  async function logout(){
    await supabase.auth.signOut({scope:"local"});
    window.location.href="/login";
  }

  return <main className="app-shell profile-page">
    <header className="topbar inner-page-topbar">
      <Link className="brand" href="/"><img className="brand-logo" src="https://raw.githubusercontent.com/jacksonjacamo130-svg/PLAYNI/main/logo-playni.png" alt="PLAYNI"/></Link>
      <div className="page-title"><UserCircle2 size={20}/><span>PERFIL</span></div>
    </header>
    <section className="profile-content">
      <div className="profile-intro">
        <span className="eyebrow">TU CUENTA</span><h1>Mi perfil</h1>
        <p>Administra la información y las opciones de tu cuenta PLAYNI.</p>
      </div>
      <section className="profile-section">
        <div className="profile-section-title"><UserRound size={17}/><span>INFORMACIÓN PERSONAL</span></div>
        <div className="profile-card">
          <div className="profile-head"><div className="profile-avatar"><UserCircle2 size={42}/></div><div><div className="profile-status"><ShieldCheck size={15}/> CUENTA PLAYNI</div><strong className="profile-name">{name}</strong></div></div>
          <div className="profile-info-list">
            <div className="profile-info-row"><div className="profile-info-icon"><Mail size={18}/></div><div><span>Correo</span><strong>{email||"Cargando..."}</strong></div></div>
            <div className="profile-info-row"><div className="profile-info-icon"><UserRound size={18}/></div><div><span>Nombre</span><strong>{name}</strong></div></div>
            <div className="profile-info-row"><div className="profile-info-icon"><MapPin size={18}/></div><div><span>País</span><strong>{country}</strong></div></div>
            <div className="profile-info-row"><div className="profile-info-icon"><VenusAndMars size={18}/></div><div><span>Género</span><strong>{gender}</strong></div></div>
            <div className="profile-info-row"><div className="profile-info-icon"><CalendarDays size={18}/></div><div><span>Fecha de nacimiento</span><strong>{birthDate}</strong></div></div>
            <div className="profile-info-row"><div className="profile-info-icon"><Badge size={18}/></div><div><span>ID de usuario</span><strong>{userId||"Cargando..."}</strong></div></div>
          </div>
        </div>
      </section>
      <section className="profile-section">
        <div className="profile-section-title"><Settings2 size={17}/><span>CUENTA Y SEGURIDAD</span></div>
        <div className="profile-menu-card">
          <Link className="profile-menu-row" href="/profile/notifications"><div className="profile-menu-icon"><Bell size={18}/></div><div><strong>Notificaciones</strong><span>Preferencias de avisos de PLAYNI</span></div><ChevronRight size={17}/></Link>
          <div className="profile-menu-row"><div className="profile-menu-icon"><KeyRound size={18}/></div><div><strong>Contraseña</strong><span>Administración de acceso a tu cuenta</span></div><em>Próximamente</em><ChevronRight size={17}/></div>
        </div>
      </section>
      <button className="profile-logout" onClick={logout}><LogOut size={17}/> CERRAR SESIÓN</button>
    </section>
    <BottomNav />
  </main>;
}
