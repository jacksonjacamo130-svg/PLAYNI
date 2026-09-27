"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "../../lib/supabase";

const countries = [
  { code: "NI", name: "Nicaragua", dial: "+505" },
  { code: "CR", name: "Costa Rica", dial: "+506" },
  { code: "HN", name: "Honduras", dial: "+504" },
  { code: "SV", name: "El Salvador", dial: "+503" },
  { code: "GT", name: "Guatemala", dial: "+502" },
  { code: "PA", name: "Panamá", dial: "+507" },
  { code: "MX", name: "México", dial: "+52" },
  { code: "US", name: "Estados Unidos", dial: "+1" }
];

const logoUrl = "https://raw.githubusercontent.com/jacksonjacamo130-svg/PLAYNI/main/logo-playni.png";

export default function LoginPage() {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("NI");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedCountry = useMemo(
    () => countries.find((item) => item.code === country) ?? countries[0],
    [country]
  );

  function fullPhone() {
    return `${selectedCountry.dial}${phone.replace(/\D/g, "")}`;
  }

  async function sendCode(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    const digits = phone.replace(/\D/g, "");
    if (fullName.trim().length < 2) {
      setError("Escribe tu nombre completo.");
      return;
    }
    if (!birthDate) {
      setError("Selecciona tu fecha de nacimiento.");
      return;
    }
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear() - (new Date() < new Date(new Date().getFullYear(), new Date(birthDate).getMonth(), new Date(birthDate).getDate()) ? 1 : 0);
    if (age < 18) {
      setError("Debes tener al menos 18 años para registrarte en PLAYNI.");
      return;
    }
    if (digits.length < 7) {
      setError("Escribe un número de teléfono válido.");
      return;
    }

    setLoading(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: fullPhone(),
      options: {
        data: {
          country_code: selectedCountry.code,
          full_name: fullName.trim(),
          birth_date: birthDate
        }
      }
    });
    setLoading(false);

    if (otpError) {
      setError(otpError.message);
      return;
    }

    setStep("code");
    setMessage("Te enviamos un código de verificación por SMS.");
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(code)) {
      setError("El código debe tener 6 dígitos.");
      return;
    }

    setLoading(true);
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: fullPhone(),
      token: code,
      type: "sms"
    });
    setLoading(false);

    if (verifyError) {
      setError("El código no es válido o ya expiró. Solicita uno nuevo.");
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <a className="auth-back" href="/">
          <ArrowLeft size={18} /> Volver
        </a>

        <div className="auth-logo-wrap">
          <img className="auth-logo" src={logoUrl} alt="PLAYNI" />
        </div>

        <div className="auth-heading">
          <span className="auth-kicker">PLAYNI</span>
          <h1>{step === "phone" ? "Entra y empieza a ganar" : "Verifica tu número"}</h1>
          <p>
            {step === "phone"
              ? "Regístrate con tu nombre, edad, país y número de teléfono. El número se verifica por SMS."
              : `Escribe el código que enviamos a ${fullPhone()}.`}
          </p>
        </div>

        {step === "phone" ? (
          <form onSubmit={sendCode} className="auth-form">
            <label htmlFor="country">País</label>
            <select
              id="country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              disabled={loading}
            >
              {countries.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name} ({item.dial})
                </option>
              ))}
            </select>

            <label htmlFor="phone">Número de teléfono</label>
            <div className="phone-field">
              <span>{selectedCountry.dial}</span>
              <input
                id="phone"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="8888 8888"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                disabled={loading}
              />
            </div>

            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? <Loader2 className="spin" size={19} /> : "ENVIAR CÓDIGO"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="auth-form">
            <label htmlFor="code">Código de verificación</label>
            <input
              id="code"
              className="otp-input"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
              disabled={loading}
            />

            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? <Loader2 className="spin" size={19} /> : "VERIFICAR Y ENTRAR"}
            </button>

            <button
              type="button"
              className="auth-link-button"
              onClick={() => {
                setStep("phone");
                setCode("");
                setMessage("");
                setError("");
              }}
              disabled={loading}
            >
              Cambiar número
            </button>
          </form>
        )}

        {message && (
          <div className="auth-message success">
            <CheckCircle2 size={18} /> {message}
          </div>
        )}

        {error && <div className="auth-message error">{error}</div>}

        <div className="auth-security">
          <ShieldCheck size={19} />
          <span>Tu número se usa para verificar tu cuenta y proteger tus recompensas.</span>
        </div>
      </section>
    </main>
  );
}
