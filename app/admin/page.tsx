"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ArrowLeft, CheckCircle2, ChevronDown, CircleDollarSign, Gamepad2, LoaderCircle, ShieldCheck, Users, WalletCards, XCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

type Profile = { id:string; full_name:string|null; display_name:string|null; country_code:string|null; gender:string|null; birth_date:string|null; created_at:string; };
type Wallet = { user_id:string; coins:number; lifetime_earned:number; };
type Offer = { id:string; provider:string; title:string; category:string|null; platform:string|null; user_reward_coins:number|null; active:boolean; country_code:string|null; synced_at:string; };
type Withdrawal = { id:string; user_id:string; paypal_email:string; amount_coins:number; status:string; requested_at:string; processed_at:string|null; rejection_reason:string|null; };
type Conversion = { id:string; provider:string; transaction_id:string; offer_id:string|null; reward_coins:number|null; payout_usd:number|null; status:string; created_at:string; };
type Tab = "overview"|"users"|"offers"|"withdrawals"|"conversions";
const money=(coins:number|null|undefined)=>"$"+(Number(coins??0)/1000).toFixed(2);

export default function AdminPage(){
  const [loading,setLoading]=useState(true),[allowed,setAllowed]=useState(false),[tab,setTab]=useState<Tab>("overview");
  const [profiles,setProfiles]=useState<Profile[]>([]),[wallets,setWallets]=useState<Wallet[]>([]),[offers,setOffers]=useState<Offer[]>([]),[withdrawals,setWithdrawals]=useState<Withdrawal[]>([]),[conversions,setConversions]=useState<Conversion[]>([]);
  const [updatingId,setUpdatingId]=useState(""),[error,setError]=useState("");

  async function loadAdmin(){
    setLoading(true);setError("");
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){window.location.href="/login";return;}
    const {data:adminRow,error:adminError}=await supabase.from("admin_users").select("user_id").eq("user_id",user.id).maybeSingle();
    if(adminError||!adminRow){setAllowed(false);setLoading(false);return;}
    setAllowed(true);
    const [a,b,c,d,e]=await Promise.all([
      supabase.from("profiles").select("id,full_name,display_name,country_code,gender,birth_date,created_at").order("created_at",{ascending:false}),
      supabase.from("wallets").select("user_id,coins,lifetime_earned").order("updated_at",{ascending:false}),
      supabase.from("offer_catalog").select("id,provider,title,category,platform,user_reward_coins,active,country_code,synced_at").order("synced_at",{ascending:false}).limit(100),
      supabase.from("withdrawals").select("id,user_id,paypal_email,amount_coins,status,requested_at,processed_at,rejection_reason").order("requested_at",{ascending:false}).limit(100),
      supabase.from("offer_conversions").select("id,provider,transaction_id,offer_id,reward_coins,payout_usd,status,created_at").order("created_at",{ascending:false}).limit(100)
    ]);
    const firstError=[a.error,b.error,c.error,d.error,e.error].find(Boolean);
    if(firstError)setError(firstError?.message??"No pudimos cargar el panel.");
    setProfiles(a.data??[]);setWallets(b.data??[]);setOffers(c.data??[]);setWithdrawals(d.data??[]);setConversions(e.data??[]);setLoading(false);
  }

  useEffect(()=>{loadAdmin();},[]);

  const walletByUser=useMemo(()=>{const m=new Map<string,Wallet>();wallets.forEach(x=>m.set(x.user_id,x));return m;},[wallets]);
  const profileByUser=useMemo(()=>{const m=new Map<string,Profile>();profiles.forEach(x=>m.set(x.id,x));return m;},[profiles]);
  const pendingWithdrawals=withdrawals.filter(x=>x.status==="pending").length;
  const totalBalanceCoins=wallets.reduce((s,x)=>s+Number(x.coins||0),0);
  const totalLifetimeCoins=wallets.reduce((s,x)=>s+Number(x.lifetime_earned||0),0);
  const activeOffers=offers.filter(x=>x.active).length;
  const creditedConversions=conversions.filter(x=>x.status==="credited").length;

  async function toggleOffer(offer:Offer){
    setUpdatingId(offer.id);
    const {error:e}=await supabase.from("offer_catalog").update({active:!offer.active}).eq("id",offer.id);
    if(e)setError(e.message);else setOffers(cur=>cur.map(x=>x.id===offer.id?{...x,active:!x.active}:x));
    setUpdatingId("");
  }

  async function updateWithdrawal(withdrawal:Withdrawal,status:string){
    setUpdatingId(withdrawal.id);setError("");
    const patch:Record<string,unknown>={status,processed_at:new Date().toISOString()};
    const {error:e}=await supabase.from("withdrawals").update(patch).eq("id",withdrawal.id);
    if(e)setError(e.message);else setWithdrawals(cur=>cur.map(x=>x.id===withdrawal.id?{...x,status,processed_at:String(patch.processed_at)}:x));
    setUpdatingId("");
  }

  if(loading)return <main className="admin-page"><div className="admin-loading"><LoaderCircle className="spin" size={26}/><span>Cargando panel de administración…</span></div></main>;
  if(!allowed)return <main className="admin-page"><section className="admin-denied"><ShieldCheck size={42}/><h1>Acceso restringido</h1><p>Esta sección solo está disponible para la cuenta administradora de PLAYNI.</p><Link href="/" className="admin-primary-link">Volver a PLAYNI</Link></section></main>;

  const tabs:[Tab,string][]=[["overview","Resumen"],["users","Usuarios"],["offers","Ofertas"],["withdrawals","Retiros"],["conversions","Conversiones"]];

  return <main className="admin-page">
    <header className="admin-topbar"><Link href="/" className="admin-back"><ArrowLeft size={18}/></Link><div className="admin-brand"><img src="https://raw.githubusercontent.com/jacksonjacamo130-svg/PLAYNI/main/logo-playni.png" alt="PLAYNI"/><span>PLAYNI</span></div><span className="admin-secure"><ShieldCheck size={15}/> ADMINISTRADOR</span></header>
    <section className="admin-content">
      <div className="admin-heading"><div><span className="eyebrow">CENTRO DE CONTROL</span><h1>Panel de administración</h1><p>Gestiona usuarios, ofertas y retiros desde un solo lugar.</p></div></div>
      {error&&<div className="admin-alert"><XCircle size={17}/> ${error}</div>}
      <div className="admin-stat-grid">
        <div className="admin-stat"><span><Users size={16}/></span><div><small>Usuarios</small><strong>{profiles.length}</strong></div></div>
        <div className="admin-stat"><span><Gamepad2 size={16}/></span><div><small>Ofertas activas</small><strong>{activeOffers}</strong></div></div>
        <div className="admin-stat"><span><WalletCards size={16}/></span><div><small>Retiros pendientes</small><strong>{pendingWithdrawals}</strong></div></div>
        <div className="admin-stat"><span><CircleDollarSign size={16}/></span><div><small>Saldo usuarios</small><strong>{money(totalBalanceCoins)}</strong></div></div>
      </div>
      <div className="admin-tabs">{tabs.map(([value,label])=><button key={value} className={tab===value?"active":""} onClick={()=>setTab(value)}>{label}</button>)}</div>

      {tab==="overview"&&<section className="admin-grid">
        <div className="admin-panel-card"><div className="admin-card-head"><div><span className="eyebrow">ACTIVIDAD</span><h2>Estado de PLAYNI</h2></div><Activity size={20}/></div><div className="admin-health">
          <div><CheckCircle2 size={17}/><span>Base de datos conectada</span><strong>OK</strong></div>
          <div><CheckCircle2 size={17}/><span>Cuenta administradora protegida</span><strong>OK</strong></div>
          <div><CheckCircle2 size={17}/><span>Ofertas sincronizadas</span><strong>{offers.length}</strong></div>
          <div><CheckCircle2 size={17}/><span>Conversiones acreditadas</span><strong>{creditedConversions}</strong></div>
        </div></div>
        <div className="admin-panel-card"><div className="admin-card-head"><div><span className="eyebrow">MONEDAS</span><h2>Economía</h2></div><CircleDollarSign size={20}/></div><div className="admin-economy">
          <div><small>Saldo disponible</small><strong>{money(totalBalanceCoins)}</strong></div>
          <div><small>Total ganado de por vida</small><strong>{money(totalLifetimeCoins)}</strong></div>
        </div></div>
      </section>}

      {tab==="users"&&<section className="admin-panel-card"><div className="admin-card-head"><div><span className="eyebrow">CUENTAS</span><h2>Usuarios registrados</h2></div><span className="admin-count">{profiles.length}</span></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Usuario</th><th>País</th><th>Género</th><th>Saldo</th><th>Registro</th></tr></thead><tbody>
          {profiles.map(profile=>{const wallet=walletByUser.get(profile.id);return <tr key={profile.id}><td><strong>{profile.full_name||profile.display_name||"Sin nombre"}</strong><span>{profile.id.slice(0,8)}…</span></td><td>{profile.country_code||"—"}</td><td>{profile.gender||"—"}</td><td><b className="admin-money">{money(wallet?.coins)}</b></td><td>{new Date(profile.created_at).toLocaleDateString("es-NI")}</td></tr>})}
        </tbody></table></div>
      </section>}

      {tab==="offers"&&<section className="admin-panel-card"><div className="admin-card-head"><div><span className="eyebrow">CATÁLOGO</span><h2>Ofertas de juegos y apps</h2></div><span className="admin-count">{offers.length}</span></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Oferta</th><th>Proveedor</th><th>Plataforma</th><th>Recompensa</th><th>Estado</th></tr></thead><tbody>
          {offers.map(offer=><tr key={offer.id}><td><strong>{offer.title}</strong><span>{offer.category||"Oferta"} · {offer.country_code||"Global"}</span></td><td>{offer.provider}</td><td>{offer.platform||"unknown"}</td><td><b className="admin-money">{money(offer.user_reward_coins)}</b></td><td><button className={"admin-switch "+(offer.active?"on":"")} disabled={updatingId===offer.id} onClick={()=>toggleOffer(offer)}>{updatingId===offer.id?<LoaderCircle className="spin" size={14}/>:<>{offer.active?"Activa":"Oculta"} <ChevronDown size={13}/></>}</button></td></tr>)}
        </tbody></table></div>
      </section>}

      {tab==="withdrawals"&&<section className="admin-panel-card"><div className="admin-card-head"><div><span className="eyebrow">PAGOS</span><h2>Solicitudes de retiro</h2></div><span className="admin-count">{withdrawals.length}</span></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Usuario</th><th>PayPal</th><th>Monto</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
          {withdrawals.map(w=>{const profile=profileByUser.get(w.user_id);const busy=updatingId===w.id;return <tr key={w.id}><td><strong>{profile?.full_name||profile?.display_name||"Usuario"}</strong><span>{new Date(w.requested_at).toLocaleDateString("es-NI")}</span></td><td>{w.paypal_email}</td><td><b className="admin-money">{money(w.amount_coins)}</b></td><td><span className={"admin-status "+w.status}>{w.status}</span></td><td><div className="admin-action-row">
            <button disabled={busy||w.status!=="pending"} onClick={()=>updateWithdrawal(w,"processing")}>Procesando</button>
            <button disabled={busy||(w.status!=="pending"&&w.status!=="processing")} onClick={()=>updateWithdrawal(w,"paid")}>Pagado</button>
            <button disabled={busy||(w.status!=="pending"&&w.status!=="processing")} onClick={()=>updateWithdrawal(w,"rejected")}>Rechazar</button>
          </div></td></tr>})}
        </tbody></table></div>
      </section>}

      {tab==="conversions"&&<section className="admin-panel-card"><div className="admin-card-head"><div><span className="eyebrow">TRACKING</span><h2>Conversiones recientes</h2></div><span className="admin-count">{conversions.length}</span></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Proveedor</th><th>Transacción</th><th>Oferta</th><th>Recompensa</th><th>Estado</th></tr></thead><tbody>
          {conversions.map(c=><tr key={c.id}><td>{c.provider}</td><td><strong>{c.transaction_id.slice(0,18)}{c.transaction_id.length>18?"…":""}</strong><span>{new Date(c.created_at).toLocaleString("es-NI")}</span></td><td>{c.offer_id||"—"}</td><td><b className="admin-money">{money(c.reward_coins)}</b><span>$${Number(c.payout_usd||0).toFixed(2)} payout</span></td><td><span className={"admin-status "+c.status}>{c.status}</span></td></tr>)}
        </tbody></table></div>
      </section>}
    </section>
  </main>;
}