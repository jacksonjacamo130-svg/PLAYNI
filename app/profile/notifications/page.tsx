"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, Check, LoaderCircle, ShieldCheck, WalletCards, Gamepad2, Trophy } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import BottomNav from "../../components/BottomNav";

type Preferences = {
  task_updates: boolean;
  rewards: boolean;
  withdrawals: boolean;
  account_alerts: boolean;
};

const defaults: Preferences = { task_updates:true, rewards:true, withdrawals:true, account_alerts:true };

const items = [
  { key:"task_updates" as const, title:"Tareas y ofertas", description:"Avisos sobre tareas, objetivos y nuevas oportunidades.", icon:Gamepad2 },
  { key:"rewards" as const, title:"Recompensas", description:"Cuando una recompensa sea acreditada en tu cuenta.", icon:Trophy },
  { key:"withdrawals" as const, title:"Retiros y pagos", description:"Actualizaciones sobre solicitudes y pagos de tu billetera.", icon:WalletCards },
  { key:"account_alerts" as const, title:"Cuenta y seguridad", description:"Avisos importantes relacionados con tu cuenta.", icon:ShieldCheck },
];

export default function NotificationsPage(){
  const [prefs,setPrefs]=useState<Preferences>(defaults);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState<string|null>(null);
  const [message,setMessage]=useState("");

  useEffect(()=>{(async()=>{
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){window.location.replace("/login");return;}
    const {data,error}=await supabase.from("notification_preferences").select("task_updates,rewards,withdrawals,account_alerts").eq("user_id",user.id).maybeSingle();
    if(!error && data) setPrefs(data);
    else if(!data) await supabase.from("notification_preferences").insert({user_id:user.id,...defaults});
    setLoading(false);
  })()},[]);

  async function toggle(key:keyof Preferences){
    const next=!prefs[key];
    setPrefs(p=>({...p,[key]:next}));
    setSaving(key);
    setMessage("");
    const {data:{user}}=await supabase.auth.getUser();
    const {error}=await supabase.from("notification_preferences").upsert({user_id:user?.id,[key]:next,updated_at:new Date().toISOString()});
    setSaving(null);
    setMessage(error ? "No pudimos guardar el cambio." : "Preferencia guardada.");
    if(error) setPrefs(p=>({...p,[key]:!next}));
    setTimeout(()=>setMessage(""),1800);
  }

  return <main className="app-shell notifications-page">
    <header className="topbar inner-page-topbar">
      <Link className="brand" href="/"><img className="brand-logo" src="https://raw.githubusercontent.com/jacksonjacamo130-svg/PLAYNI/main/logo-playni.png" alt="PLAYNI"/></Link>
      <Link className="notifications-back" href="/profile"><ArrowLeft size={18}/><span>PERFIL</span></Link>
    </header>
    <section className="notifications-content">
      <div className="notifications-intro">
        <span className="eyebrow"><Bell size={13}/> PREFERENCIAS</span>
        <h1>Notificaciones</h1>
        <p>Elegí qué avisos querés recibir de PLAYNI.</p>
      </div>
      <section className="notifications-card">
        {loading ? <div className="notifications-loading"><LoaderCircle className="spin" size={22}/> Cargando preferencias...</div> :
          items.map(({key,title,description,icon:Icon})=><div className="notification-row" key={key}>
            <div className="notification-icon"><Icon size={19}/></div>
            <div className="notification-copy"><strong>{title}</strong><span>{description}</span></div>
            <button className={prefs[key] ? "switch on" : "switch"} onClick={()=>toggle(key)} disabled={saving===key} aria-label={prefs[key] ? "Desactivar" : "Activar"}>
              <span>{saving===key ? <LoaderCircle className="spin" size={13}/> : prefs[key] ? <Check size={13}/> : null}</span>
            </button>
          </div>)
        }
      </section>
      {message && <div className="notifications-saved"><Check size={15}/>{message}</div>}
      <div className="notifications-note">
        <ShieldCheck size={18}/>
        <div><strong>¿Cómo funciona?</strong><p>Estas opciones controlan tus preferencias. Los avisos se podrán enviar cuando PLAYNI tenga habilitado el sistema de notificaciones.</p></div>
      </div>
    </section>
    <BottomNav/>
  </main>;
}
