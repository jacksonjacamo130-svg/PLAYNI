"use client";

import Link from "next/link";
import { ListChecks, ArrowLeft, Clock3, Gamepad2 } from "lucide-react";
import BottomNav from "../components/BottomNav";

export default function TasksPage(){
  return <main className="app-shell tasks-page">
    <header className="topbar"><Link className="back-link" href="/"><ArrowLeft size={19}/></Link><div className="brand"><ListChecks size={22}/><span>MIS TAREAS</span></div><Link className="wallet-mini" href="/wallet">Billetera</Link></header>
    <section className="simple-section tasks-section"><div className="simple-head"><div><span className="eyebrow">TU PROGRESO</span><h1>Mis tareas</h1></div></div>
      <div className="tasks-empty"><div className="continue-icon"><Gamepad2 size={25}/></div><h2>Aún no tienes tareas</h2><p>Cuando empieces una oferta, aparecerá aquí con sus objetivos, progreso y tiempo restante.</p><Link className="primary-btn" href="/games">VER OFERTAS <Gamepad2 size={17}/></Link></div>
      <div className="task-help"><Clock3 size={17}/><span>El tiempo y los objetivos de cada oferta se muestran antes de empezar.</span></div>
    </section>
    <BottomNav />
  </main>;
}