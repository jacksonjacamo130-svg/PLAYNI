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
const PLAYNI_URL = "https://playni-app.vercel.app";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register" | "reset">("login");
  const [fullName, setFullName] = useState(""), [birthDate, setBirthDate] = useState(""), [gender, setGender] = useState(""), [country, setCountry] = useState("NI");
  const [phone, setPhone] = useState(""), [email, setEmail] = useState(""), [password, setPassword] = useState(""), [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false), [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false), [message, setMessage] = useState(""), [error, setError] = useState("");
  const selectedCountry = useMemo(() => countries.find((item) => item.code === country) ?? countries[0], [country]);
  const fullPhone = () => selectedCountry.dial + phone.replace(/\D/g, "");

  function switchMode(next: "login" | "register" | "reset") { setMode(next); setError(""); setMessage(""); }
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "1") setMode("reset");
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
            <label htmlFor="fullName">Nombre completo</label><input id="fullName" autoComplete="name" placeholder="Tu nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading} />
            <label htmlFor="birthDate">Fecha de nacimiento</label><input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} disabled={loading} />
            <label htmlFor="gender">Género</label><select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} disabled={loading}>
              <option value="">Selecciona una opción</option>
              <option value="male">Hombre</option>
              <option value="female">Mujer</option>
              <option value="other">Otro</option>
            </select>
            <label htmlFor="country">País</label><select id="country" value={country} onChange={(e) => setCountry(e.target.value)} disabled={loading}>{countries.map((item) => <option key={item.code} value={item.code}>{item.name} ({item.dial})</option>)}</select>
            <label htmlFor="phone">Número de teléfono</label><div className="phone-field"><span>{selectedCountry.dial}</span><input id="phone" inputMode="numeric" autoComplete="tel" placeholder="8888 8888" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} /></div>
          </>}
          <label htmlFor="email">Correo electrónico</label><input id="email" type="email" autoComplete="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading || mode === "reset"} />
          <label htmlFor="password">Contraseña</label>
          <div className="password-field">
            <input id="password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
            <button type="button" className="password-toggle" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} onClick={() => setShowPassword((value) => !value)} disabled={loading}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {(mode === "register" || mode === "reset") && <>
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <div className="password-field">
              <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" placeholder="Repite tu contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} />
              <button type="button" className="password-toggle" aria-label={showConfirmPassword ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"} onClick={() => setShowConfirmPassword((value) => !value)} disabled={loading}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </>}
          <button className="auth-button" type="submit" disabled={loading}>{loading ? <Loader2 className="spin" size={19} /> : mode === "login" ? "INICIAR SESIÓN" : mode === "reset" ? "CAMBIAR CONTRASEÑA" : "CREAR CUENTA"}</button>
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
      </section>
    </main>
  );
}
