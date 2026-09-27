"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, WalletCards, Coins, CreditCard, ShieldCheck, Clock3, ChevronRight, LoaderCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import BottomNav from "../components/BottomNav";

type Wallet = { coins: number; lifetime_earned: number };
type Transaction = { id: string; type: string; amount_coins: number; status: string; description: string | null; created_at: string };

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet>({ coins: 0, lifetime_earned: 0 });
  const [paypal, setPaypal] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingCoins, setPendingCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState("");

  async function loadWallet() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }
    const [{ data: walletData }, { data: txData }] = await Promise.all([
      supabase.from("wallets").select("coins,lifetime_earned").eq("user_id", user.id).maybeSingle(),
      supabase.from("wallet_transactions").select("id,type,amount_coins,status,description,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20)
    ]);
    if (walletData) setWallet(walletData);
    const txs = txData ?? [];
    setTransactions(txs);
    setPendingCoins(txs.filter((tx) => tx.type === "earning" && tx.status === "pending").reduce((sum, tx) => sum + Number(tx.amount_coins), 0));
    setLoading(false);
  }

  useEffect(() => { loadWallet(); }, []);

  const balance = (wallet.coins / 1000).toFixed(2);
  const earned = (wallet.lifetime_earned / 1000).toFixed(2);
  const pending = (pendingCoins / 1000).toFixed(2);

  async function requestWithdrawal() {
    setMessage("");
    setRequesting(true);
    const { error } = await supabase.rpc("request_paypal_withdrawal", {
      p_paypal_email: paypal.trim(),
      p_amount_coins: wallet.coins
    });
    if (error) {
      const friendly =
        error.message.includes("minimum_withdrawal_not_reached") ? "El mínimo de retiro es $10.00." :
        error.message.includes("insufficient_balance") ? "No tienes saldo suficiente para este retiro." :
        error.message.includes("invalid_paypal_email") ? "Revisa el correo de PayPal." :
        "No pudimos crear la solicitud. Inténtalo de nuevo.";
      setMessage(friendly);
    } else {
      setMessage("Solicitud enviada. Tu retiro quedó pendiente de revisión.");
      await loadWallet();
    }
    setRequesting(false);
  }

  return (
    <main className="app-shell wallet-page">
      <header className="topbar">
        <a className="back-link" href="/"><ArrowLeft size={19} /></a>
        <div className="brand"><WalletCards size={25} /><span>BILLETERA</span></div>
        <div className="wallet-mini">BILLETERA</div>
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
          <div className="paypal-mark official-paypal-mark"><img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal"/></div>
        </div>
        <p className="wallet-muted">Usa el correo de tu cuenta PayPal. Las recompensas primero deben validarse y luego estarán disponibles para retirar.</p>
        <label className="wallet-label">Correo de PayPal</label>
        <input className="wallet-input" type="email" placeholder="tu-correo@paypal.com" value={paypal} onChange={(e) => setPaypal(e.target.value)} />
        <button className="wallet-withdraw" disabled={!paypal.includes("@") || wallet.coins < 10000 || requesting} onClick={requestWithdrawal}>
          {requesting ? <><LoaderCircle size={18} className="spin" /> PROCESANDO</> : <>RETIRAR ${balance} <ChevronRight size={18} /></>}
        </button>
        <div className="wallet-note"><ShieldCheck size={15} /> Los retiros pasan por validación antes del pago.</div>
        {message && <div className="wallet-message">{message}</div>}
      </section>

      <section className="wallet-history">
        <div className="section-head"><div><span className="eyebrow">MOVIMIENTOS</span><h2>Historial</h2></div></div>
        {transactions.length === 0 ? (
          <div className="empty-history"><WalletCards size={28} /><strong>Aún no tienes movimientos</strong><p>Cuando ganes monedas o hagas un retiro, aparecerá aquí.</p></div>
        ) : (
          <div className="transaction-list">
            {transactions.map((tx) => (
              <div className="transaction-row" key={tx.id}>
                <div><strong>{tx.description || (tx.type === "earning" ? "Recompensa" : "Movimiento")}</strong><span>{new Date(tx.created_at).toLocaleDateString("es-NI")}</span></div>
                <div className="transaction-amount"><strong>{tx.type === "withdrawal" ? "-" : "+"}${(Number(tx.amount_coins) / 1000).toFixed(2)}</strong><span>{tx.status === "pending" ? "Pendiente" : tx.status === "paid" ? "Pagado" : tx.status === "available" ? "Disponible" : tx.status}</span></div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
