"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ListChecks, Clock3, Gamepad2, LoaderCircle, CheckCircle2, Circle, Smartphone, TimerReset } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { supabase } from "../../lib/supabase";

type Task = {
  id:string; name:string; reward_coins:number|null;
  status:"pending"|"completed"|"credited"; completed_at:string|null;
};

type StartedOffer = {
  id:string; title:string; description:string; icon_url:string|null;
  category:string; platform:string; reward_coins:number; started_at:string;
  deadline_at:string|null; install_confirmed:boolean; progress_percent:number;
  status:"active"|"completed"|"expired"; user_offer_tasks:Task[];
};

function effectiveStatus(offer: StartedOffer): "active"|"completed"|"expired" {
  if (offer.status === "completed") return "completed";
  if (offer.deadline_at && new Date(offer.deadline_at).getTime() <= Date.now()) return "expired";
  const total = offer.user_offer_tasks.length;
  const done = offer.user_offer_tasks.filter(t => t.status !== "pending").length;
  if (total > 0 && done === total) return "completed";
  return offer.status;
}

function formatDate(value:string|null) {
  if (!value) return "Sin límite";
  return new Intl.DateTimeFormat("es-NI", { day:"2-digit", month:"short", year:"numeric" }).format(new Date(value));
}

export default function TasksPage(){
  const [offers,setOffers]=useState<StartedOffer[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{(async()=>{
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){window.location.replace("/login");return;}
    const {data,error}=await supabase
      .from("user_offers")
      .select("id,title,description,icon_url,category,platform,reward_coins,started_at,deadline_at,install_confirmed,progress_percent,status,user_offer_tasks(id,name,reward_coins,status,completed_at)")
      .eq("user_id",user.id)
      .order("started_at",{ascending:false});
    if(!error) setOffers((data??[]) as StartedOffer[]);
    setLoading(false);
  })()},[]);

  const sections=useMemo(()=>{
    const normalized=offers.map(o=>({...o,computedStatus:effectiveStatus(o)}));
    return {
      active:normalized.filter(o=>o.computedStatus==="active"),
      completed:normalized.filter(o=>o.computedStatus==="completed"),
      expired:normalized.filter(o=>o.computedStatus==="expired")
    };
  },[offers]);

  function progressFor(offer:StartedOffer) {
    if (!offer.user_offer_tasks.length) return Number(offer.progress_percent||0);
    const done=offer.user_offer_tasks.filter(t=>t.status!=="pending").length;
    return Math.round((done/offer.user_offer_tasks.length)*100);
  }

  return <main className="app-shell tasks-page">
    <header className="topbar inner-page-topbar">
      <Link className="brand" href="/">
        <img className="brand-logo" src="https://raw.githubusercontent.com/jacksonjacamo130-svg/PLAYNI/main/logo-playni.png" alt="PLAYNI"/>
      </Link>
      <div className="page-title"><ListChecks size={20}/><span>MIS TAREAS</span></div>
    </header>

    <section className="simple-section tasks-section">
      <div className="simple-head"><div><span className="eyebrow">TU PROGRESO</span><h1>Mis tareas</h1></div></div>

      {loading ? <div className="tasks-loading"><LoaderCircle className="spin" size={26}/><span>Cargando tus juegos...</span></div> :
      offers.length===0 ? <div className="tasks-empty"><div className="continue-icon"><Gamepad2 size={25}/></div><h2>Aún no tienes tareas</h2><p>Cuando empieces una oferta, aparecerá aquí con sus objetivos, progreso y tiempo restante.</p><Link className="primary-btn" href="/">DESCUBRIR OFERTAS <Gamepad2 size={17}/></Link></div> :
      <div className="started-offers-list">
        {sections.active.length>0 && <section className="task-group"><div className="task-group-title"><span>ACTIVAS</span><strong>{sections.active.length}</strong></div>{sections.active.map(o=>{
          const progress=progressFor(o);
          return <article className="started-offer-card" key={o.id}>
            <div className="started-offer-main">
              <div className="started-offer-icon">{o.icon_url?<img src={o.icon_url} alt=""/>:<Gamepad2 size={26}/>}</div>
              <div className="started-offer-info"><div className="started-offer-name-row"><h2>{o.title}</h2><span className="started-status active">ACTIVA</span></div><p>{o.description||"Completa los objetivos para ganar tus recompensas."}</p><div className="started-offer-meta"><span><TimerReset size={14}/> Iniciada {formatDate(o.started_at)}</span><span><Clock3 size={14}/> {o.deadline_at ? "Hasta " + formatDate(o.deadline_at) : "Sin límite"}</span></div></div>
            </div>
            <div className="started-progress"><div className="started-progress-top"><span>Progreso</span><strong>{progress}%</strong></div><div className="started-progress-track"><span style={{width:progress+"%"}}/></div></div>
            <div className="install-state"><Smartphone size={15}/><span>{o.install_confirmed?"Instalación confirmada":"Instalación pendiente de verificación"}</span></div>
            <div className="goal-list">{o.user_offer_tasks.length?o.user_offer_tasks.map(t=><div className="goal-row" key={t.id}>{t.status==="pending"?<Circle size={17}/>:<CheckCircle2 size={17}/>}<span>{t.name}</span>{t.reward_coins!=null&&<strong>+{t.reward_coins}</strong>}</div>):<div className="goal-row goal-empty"><Circle size={17}/><span>Los objetivos aparecerán cuando el proveedor los envíe.</span></div>}</div>
          </article>
        })}</section>}

        {sections.completed.length>0 && <section className="task-group"><div className="task-group-title"><span>COMPLETADAS</span><strong>{sections.completed.length}</strong></div>{sections.completed.map(o=><article className="started-offer-card compact" key={o.id}><div className="started-offer-icon">{o.icon_url?<img src={o.icon_url} alt=""/>:<Gamepad2 size={26}/>}</div><div className="started-offer-info"><div className="started-offer-name-row"><h2>{o.title}</h2><span className="started-status completed">COMPLETADA</span></div><p>Esta tarea ya aparece como completada en tu historial.</p></div><div className="completed-check"><CheckCircle2 size={24}/></div></article>)}</section>}

        {sections.expired.length>0 && <section className="task-group"><div className="task-group-title"><span>EXPIRADAS</span><strong>{sections.expired.length}</strong></div>{sections.expired.map(o=><article className="started-offer-card compact" key={o.id}><div className="started-offer-icon">{o.icon_url?<img src={o.icon_url} alt=""/>:<Gamepad2 size={26}/>}</div><div className="started-offer-info"><div className="started-offer-name-row"><h2>{o.title}</h2><span className="started-status expired">EXPIRADA</span></div><p>El plazo de esta oferta terminó.</p></div></article>)}</section>}
      </div>}

      <div className="task-help"><Clock3 size={17}/><span>PLAYNI conserva tus juegos iniciados y sus objetivos asociados a tu cuenta.</span></div>
    </section>
    <BottomNav />
  </main>;
}
