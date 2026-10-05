"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserCircle2, LogOut, Mail, MapPin, UserRound, Bell, KeyRound, Settings2, ChevronRight, Clock3, ShieldCheck, FileText, LockKeyhole } from "lucide-react";
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
  const [publicId,setPublicId]=useState("");
  const [isAdmin,setIsAdmin]=useState(false);

  useEffect(()=>{(async()=>{
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){window.location.href="/login";return;}
    setEmail(user.email??"");
    setUserId(user.id);
    const {data:adminRow}=await supabase.from("admin_users").select("user_id").eq("user_id",user.id).maybeSingle();
    setIsAdmin(!!adminRow);
    const {data}=await supabase.from("profiles").select("public_id,full_name,display_name,country_code,birth_date,gender").eq("id",user.id).maybeSingle();
    setPublicId(data?.public_id??"");
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
        <span className="eyebrow">MI PERFIL</span><h1>{name}</h1>
        <p>ID de usuario · <strong>{publicId||"Cargando..."}</strong></p>
      </div>
      <section className="profile-section">
        <div className="profile-section-title"><UserRound size={17}/><span>DATOS PERSONALES</span></div>
        <div className="profile-card">
          <div className="profile-info-list profile-info-list-first">
            <div className="profile-info-row"><div className="profile-info-icon"><Mail size={18}/></div><div><span>Correo</span><strong>{email||"Cargando..."}</strong></div></div>
            <div className="profile-info-row"><div className="profile-info-icon"><MapPin size={18}/></div><div><span>País</span><strong>{country}</strong></div></div>
            <div className="profile-info-row"><div className="profile-info-icon"><UserRound size={18}/></div><div><span>Género</span><strong>{gender}</strong></div></div>
            <div className="profile-info-row"><div className="profile-info-icon"><Clock3 size={18}/></div><div><span>Fecha de nacimiento</span><strong>{birthDate}</strong></div></div>
          </div>
        </div>
      </section>
      <section className="profile-section">
        <div className="profile-section-title"><Settings2 size={17}/><span>CUENTA Y SEGURIDAD</span></div>
        <div className="profile-menu-card">
          {isAdmin && <Link href="/admin" className="profile-menu-row profile-menu-link"><div className="profile-menu-icon"><ShieldCheck size={18}/></div><div><strong>Panel de administración</strong><span>Gestiona PLAYNI, ofertas y retiros</span></div><ChevronRight size={17}/></Link>}
          <button type="button" className="profile-menu-row profile-notifications-link" onClick={()=>{window.location.href="/profile/notifications";}}><div className="profile-menu-icon"><Bell size={18}/></div><div><strong>Notificaciones</strong><span>Preferencias de avisos de PLAYNI</span></div><ChevronRight size={17}/></button>
          <Link href="/profile/password" className="profile-menu-row profile-menu-link"><div className="profile-menu-icon"><KeyRound size={18}/></div><div><strong>Contraseña</strong><span>Cambia la contraseña de tu cuenta</span></div><ChevronRight size={17}/></Link>
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-title"><LockKeyhole size={17}/><span>LEGAL Y PRIVACIDAD</span></div>
        <div className="profile-menu-card">
          <Link href="/terminos" className="profile-menu-row profile-menu-link"><div className="profile-menu-icon"><FileText size={18}/></div><div><strong>Términos y condiciones</strong><span>Reglas de uso, ofertas, recompensas y seguridad</span></div><ChevronRight size={17}/></Link>
          <Link href="/privacidad" className="profile-menu-row profile-menu-link"><div className="profile-menu-icon"><LockKeyhole size={18}/></div><div><strong>Política de privacidad</strong><span>Cómo usamos y protegemos tus datos</span></div><ChevronRight size={17}/></Link>
        </div>
      </section>

      <button className="profile-logout" onClick={logout}><LogOut size={17}/> CERRAR SESIÓN</button>
    </section>
    <BottomNav />
  </main>;
}
