"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import BottomNav from "../components/BottomNav";

export default function PasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login";
    })();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    if (newPassword !== confirmPassword) return setError("Las contraseñas no coinciden.");

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (updateError) return setError("No pudimos actualizar la contraseña. Inténtalo nuevamente.");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("Tu contraseña se actualizó correctamente.");
  }

  return <main className="app-shell profile-page">
    <header className="topbar inner-page-topbar">
      <Link className="brand" href="/"><img className="brand-logo" src="https://raw.githubusercontent.com/jacksonjacamo130-svg/PLAYNI/main/logo-playni.png" alt="PLAYNI"/></Link>
      <div className="page-title"><KeyRound size={20}/><span>CONTRASEÑA</span></div>
    </header>

    <section className="profile-content">
      <div className="profile-intro">
        <Link href="/profile" className="profile-back-link"><ArrowLeft size={16}/> Volver al perfil</Link>
        <span className="eyebrow">CUENTA Y SEGURIDAD</span>
        <h1>Cambiar contraseña</h1>
        <p>Usa una contraseña que no compartas con nadie.</p>
      </div>

      <section className="profile-section">
        <div className="profile-section-title"><KeyRound size={17}/><span>NUEVA CONTRASEÑA</span></div>
        <div className="profile-card">
          <form onSubmit={submit} className="auth-form">
            <label htmlFor="newPassword">Nueva contraseña</label>
            <div className="password-field">
              <input id="newPassword" type={showNew ? "text" : "password"} autoComplete="new-password" placeholder="Mínimo 6 caracteres" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={loading}/>
              <button type="button" className="password-toggle" aria-label={showNew ? "Ocultar contraseña" : "Mostrar contraseña"} onClick={() => setShowNew((value) => !value)} disabled={loading}>
                {showNew ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>

            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <div className="password-field">
              <input id="confirmPassword" type={showConfirm ? "text" : "password"} autoComplete="new-password" placeholder="Repite tu contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading}/>
              <button type="button" className="password-toggle" aria-label={showConfirm ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"} onClick={() => setShowConfirm((value) => !value)} disabled={loading}>
                {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>

            <button className="auth-button" type="submit" disabled={loading}>{loading ? <Loader2 className="spin" size={19}/> : "ACTUALIZAR CONTRASEÑA"}</button>
          </form>

          {message && <div className="auth-message success"><CheckCircle2 size={18}/> {message}</div>}
          {error && <div className="auth-message error">{error}</div>}
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-card">
          <Link href="/login" className="profile-menu-row profile-menu-link"><div><strong>¿Olvidaste tu contraseña?</strong><span>Envíate un enlace de recuperación por correo electrónico.</span></div><ArrowLeft size={17}/></Link>
        </div>
      </section>
    </section>

    <BottomNav />
  </main>;
}
