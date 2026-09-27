"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, WalletCards, Coins, CreditCard, ShieldCheck, Clock3, ChevronRight } from "lucide-react";
import { supabase } from "../../lib/supabase";

type Wallet = { coins: number; lifetime_earned: number };

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet>({ coins: 0, lifetime_earned: 0 });
  const [paypal, setPaypal] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data } = await supabase.from("wallets").select("coins,lifetime_earned").eq("user_id", user.id).maybeSingle();
      if (data) setWallet(data);
      setLoading(false);
    }
    load();
  }, []);

  const balance = (wallet.coins / 1000).toFixed(2);
  const earned = (wallet.lifetime_earned / 1000).toFixed(2);

  return (
    <main className="app-shell wallet-page">
      <header className="topbar">
        <a className="back-link" href="/"><ArrowLeft size={19} /></a>
        <div className="brand"><WalletCards size={25} /><span>BILLETERA</span></div>
        <div className="wallet-mini"><Coins size={16} /> ${balance}</div>
      </header>

      <section className="wallet-hero">
        <span className="eyebrow">TU DINERO EN PLAYNI</span>
        <h1>${loading ? "—" : balance}</h1>
        <p>Saldo disponible</p>
        <div className="wallet-total"><span>Ganado de por vida</span><strong>${earned}</strong></div>
      </section>

      <section className="wallet-card">
        <div className="wallet-card-head">
          <div><span className="eyebrow">MÉTODO DE RETIRO</span><h2>PayPal</h2></div>
          <div className="paypal-mark">P</div>
        </div>
        <p className="wallet-muted">Agrega el correo de tu cuenta PayPal para recibir tus pagos cuando cumplas el mínimo de retiro.</p>
        <label className="wallet-label">Correo de PayPal</label>
        <input className="wallet-input" type="email" placeholder="tu-correo@paypal.com" value={paypal} onChange={(e) => setPaypal(e.target.value)} />
        <button className="wallet-withdraw" disabled={!paypal.includes("@") || wallet.coins < 10000}>
          SOLICITAR RETIRO <ChevronRight size={18} />
        </button>
        <div className="wallet-note"><ShieldCheck size={15} /> El retiro será validado antes de enviarse.</div>
      </section>

      <section className="wallet-info-grid">
        <div><Coins size={20} /><span>Monedas</span><strong>{wallet.coins.toLocaleString()}</strong></div>
        <div><Clock3 size={20} /><span>Mínimo de retiro</span><strong>$10.00</strong></div>
        <div><CreditCard size={20} /><span>Método</span><strong>PayPal</strong></div>
      </section>

      <section className="wallet-history">
        <div className="section-head"><div><span className="eyebrow">MOVIMIENTOS</span><h2>Historial</h2></div></div>
        <div className="empty-history"><WalletCards size={28} /><strong>Aún no tienes movimientos</strong><p>Cuando ganes monedas o hagas un retiro, aparecerá aquí.</p></div>
      </section>
    </main>
  );
}
