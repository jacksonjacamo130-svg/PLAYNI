"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "../../lib/supabase";

const countries = [
  { code: "NI", name: "Nicaragua", dial: "+505" }, { code: "CR", name: "Costa Rica", dial: "+506" },
  { code: "HN", name: "Honduras", dial: "+504" }, { code: "SV", name: "El Salvador", dial: "+503" },
  { code: "GT", name: "Guatemala", dial: "+502" }, { code: "PA", name: "Panamá", dial: "+507" },
  { code: "MX", name: "México", dial: "+52" }, { code: "US", name: "Estados Unidos", dial: "+1" }
];
const logoUrl = "https://raw.githubusercontent.com/jacksonjacamo130-svg/PLAYNI/main/logo-playni.png";
const PLAYNI_URL = "https://playniapp.site";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register" | "reset">("login");
  const [fullName, setFullName] = useState(""), [birthDate, setBirthDate] = useState(""), [gender, setGender] = useState(""), [country, setCountry] = useState("NI");
  const [phone, setPhone] = useState(""), [email, setEmail] = useState(""), [password, setPassword] = useState(""), [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false), [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [loading, setLoading] = useState(false), [googleLoading, setGoogleLoading] = useState(false), [confirmingEmail, setConfirmingEmail] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("confirmed") === "1"), [message, setMessage] = useState(""), [error, setError] = useState("");
  const selectedCountry = useMemo(() => countries.find((item) => item.code === country) ?? countries[0], [country]);
  const fullPhone = () => selectedCountry.dial + phone.replace(/\D/g, "");

  function switchMode(next: "login" | "register" | "reset") { setMode(next); setError(""); setMessage(""); }
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "1") setMode("reset");

    const isEmailConfirmation = params.get("confirmed") === "1";
    if (isEmailConfirmation) {
      let cancelled = false;
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (!cancelled && session && event !== "SIGNED_OUT") {
          window.location.replace("/");
        }
      });

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (cancelled) return;
        if (session) {
          window.location.replace("/");
          return;
        }
        setTimeout(() => {
          if (cancelled) return;
          setConfirmingEmail(false);
          setMessage("Correo confirmado correctamente. Ya puedes iniciar sesión.");
          window.history.replaceState({}, "", "/login");
        }, 1200);
      });

      return () => {
        cancelled = true;
        subscription.unsubscribe();
      };
    }

    const hasOAuthReturn = window.location.hash.includes("access_token") || params.has("code");
    if (!hasOAuthReturn) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        window.location.replace("/?oauth_return=google");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.replace("/");
    });

    return () => subscription.unsubscribe();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setMessage("");
    if (!email.trim() || !email.includes("@")) return setError("Escribe un correo electrónico válido.");
    if (password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    if ((mode === "register" || mode === "reset") && password !== confirmPassword) return setError("Las contraseñas no coinciden.");

    if (mode === "reset") {
      const { error: resetError } = await supabase.auth.updateUser({ password });
      setLoading(false);
      if (resetError) return setError("No pudimos cambiar la contraseña. Abre nuevamente el enlace de recuperación desde tu correo.");
      setMessage("Contraseña actualizada correctamente. Ya puedes continuar en PLAYNI.");
      window.history.replaceState({}, "", "/login");
      setTimeout(() => { window.location.href = "/"; }, 700);
      return;
    }

    if (mode === "register") {
      if (fullName.trim().length < 2) return setError("Escribe tu nombre completo.");
      if (!birthDate) return setError("Selecciona tu fecha de nacimiento.");
      if (!gender) return setError("Selecciona tu género.");
      const today = new Date(), birth = new Date(birthDate + "T00:00:00");
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
      if (age < 18) return setError("Debes tener al menos 18 años para registrarte en PLAYNI.");
      if (phone.replace(/\D/g, "").length < 7) return setError("El teléfono es obligatorio para crear la cuenta.");
      if (!acceptedLegal) return setError("Debes aceptar los Términos y Condiciones y la Política de Privacidad para crear tu cuenta.");
    }

    setLoading(true);
    if (mode === "login") {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setLoading(false);
      if (loginError) return setError("Correo o contraseña incorrectos.");
      window.location.href = "/";
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(), password,
      options: { emailRedirectTo: PLAYNI_URL + "/login?confirmed=1", data: { full_name: fullName.trim(), birth_date: birthDate, gender, country_code: selectedCountry.code, phone_e164: fullPhone(), phone_verified: false } }
    });
    setLoading(false);
    if (signUpError) return setError(signUpError.message);
    if (data.session) { window.location.href = "/"; return; }
    setMessage("Cuenta creada. Revisa tu correo para confirmar la cuenta y después inicia sesión.");
    setMode("login");
  }

  async function signInWithGoogle() {
    setGoogleLoading(true); setError(""); setMessage("");
    try { window.sessionStorage.setItem("playni_google_pending", "1"); } catch {}
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/login" }
    });
    if (googleError) {
      setGoogleLoading(false);
      return setError("No pudimos iniciar sesión con Google. Inténtalo de nuevo.");
    }
  }

  if (confirmingEmail) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="auth-logo-wrap"><img className="auth-logo" src={logoUrl} alt="PLAYNI" /></div>
          <div className="auth-heading">
            <h1>Cuenta confirmada</h1>
            <p>Estamos activando tu acceso. Un momento...</p>
          </div>
          <div style={{display:"flex",justifyContent:"center",paddingTop:10}}><Loader2 className="spin" size={24} /></div>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-logo-wrap"><img className="auth-logo" src={logoUrl} alt="PLAYNI" /></div>
        <div className="auth-heading">
          <h1>{mode === "login" ? "Inicia sesión" : mode === "reset" ? "Cambia tu contraseña" : "Crea tu cuenta"}</h1>
          <p>{mode === "login" ? "Entra con el correo y la contraseña de tu cuenta PLAYNI." : mode === "reset" ? "Escribe una nueva contraseña para recuperar el acceso a tu cuenta." : "Crea tu cuenta con correo y contraseña. El teléfono se solicita como requisito de seguridad."}</p>
        </div>
        {mode !== "reset" && <div className="auth-tabs">
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>INICIAR SESIÓN</button>
          <button type="button" className={mode === "register" ? "active" : ""} onClick={() => switchMode("register")}>REGISTRARSE</button>
        </div>}
        <form onSubmit={submit} className="auth-form">
          {mode === "register" && <>
            <label htmlFor="fullName">Nombre completo</label><input id="fullName" autoComplete="name" placeholder="Tu nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading || googleLoading} />
            <label htmlFor="birthDate">Fecha de nacimiento</label><input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} disabled={loading || googleLoading} />
            <label htmlFor="gender">Género</label><select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} disabled={loading || googleLoading}>
              <option value="">Selecciona una opción</option>
              <option value="male">Hombre</option>
              <option value="female">Mujer</option>
              <option value="other">Otro</option>
            </select>
            <label htmlFor="country">País</label><select id="country" value={country} onChange={(e) => setCountry(e.target.value)} disabled={loading || googleLoading}>{countries.map((item) => <option key={item.code} value={item.code}>{item.name} ({item.dial})</option>)}</select>
            <label htmlFor="phone">Número de teléfono</label><div className="phone-field"><span>{selectedCountry.dial}</span><input id="phone" inputMode="numeric" autoComplete="tel" placeholder="8888 8888" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading || googleLoading} /></div>
          </>}
          <label htmlFor="email">Correo electrónico</label><input id="email" type="email" autoComplete="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading || googleLoading || mode === "reset"} />
          <label htmlFor="password">Contraseña</label>
          <div className="password-field">
            <input id="password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading || googleLoading} />
            <button type="button" className="password-toggle" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} onClick={() => setShowPassword((value) => !value)} disabled={loading || googleLoading}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {(mode === "register" || mode === "reset") && <>
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <div className="password-field">
              <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" placeholder="Repite tu contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading || googleLoading} />
              <button type="button" className="password-toggle" aria-label={showConfirmPassword ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"} onClick={() => setShowConfirmPassword((value) => !value)} disabled={loading || googleLoading}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </>}
          {mode === "register" && <label className="legal-consent"><input type="checkbox" checked={acceptedLegal} onChange={(e) => setAcceptedLegal(e.target.checked)} disabled={loading || googleLoading} /><span>Acepto los <a href="/terminos">Términos y Condiciones</a> y la <a href="/privacidad">Política de Privacidad</a> de PLAYNI.</span></label>}
          <button className="auth-button" type="submit" disabled={loading || googleLoading}>{loading ? <Loader2 className="spin" size={19} /> : mode === "login" ? "INICIAR SESIÓN" : mode === "reset" ? "CAMBIAR CONTRASEÑA" : "CREAR CUENTA"}</button>
          {mode === "login" && <>
            <div className="auth-divider"><span>o</span></div>
            <button type="button" className="google-button" onClick={signInWithGoogle} disabled={loading || googleLoading}>
              {googleLoading ? <Loader2 className="spin" size={19} /> : <svg className="google-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M21.35 12.27c0-.68-.06-1.33-.17-1.95H12v3.69h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.13Z"/>
                <path fill="#34A853" d="M12 21.73c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.55 0-4.71-1.72-5.49-4.03H3.27v2.53A9.74 9.74 0 0 0 12 21.73Z"/>
                <path fill="#FBBC05" d="M6.51 13.81A5.86 5.86 0 0 1 6.2 12c0-.63.11-1.25.31-1.81V7.66H3.27A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.05 1.02 4.34l3.24-2.53Z"/>
                <path fill="#EA4335" d="M12 6.16c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.23 14.63 2.27 12 2.27a9.74 9.74 0 0 0-8.73 5.39l3.24 2.53c.78-2.31 2.94-4.03 5.49-4.03Z"/>
              </svg>}
              {googleLoading ? "CONECTANDO CON GOOGLE..." : "CONTINUAR CON GOOGLE"}
            </button>
          </>}
        {mode === "login" && <button type="button" className="auth-link-button" onClick={async () => {
          if (!email.trim() || !email.includes("@")) return setError("Escribe primero tu correo electrónico.");
          setLoading(true); setError(""); setMessage("");
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: PLAYNI_URL + "/login?reset=1" });
          setLoading(false);
          if (resetError) return setError("No pudimos enviar el enlace de recuperación. Inténtalo de nuevo.");
          setMessage("Te enviamos un enlace para cambiar tu contraseña. Revisa tu correo y la carpeta de spam.");
        }}>¿Olvidaste tu contraseña?</button>}
        {mode === "reset" && <button type="button" className="auth-link-button" onClick={() => { window.location.href = "/login"; }}>Volver a iniciar sesión</button>}
        </form>
        {message && <div className="auth-message success"><CheckCircle2 size={18} /> {message}</div>}
        {error && <div className="auth-message error">{error}</div>}
        <div className="auth-security"><ShieldCheck size={19} /><span>Tu teléfono se guarda como dato de seguridad, pero no se utiliza para iniciar sesión.</span></div>
        <div className="auth-legal-links"><a href="/terminos">Términos y Condiciones</a><span>•</span><a href="/privacidad">Política de Privacidad</a></div>
      </section>
    </main>
  );
}
