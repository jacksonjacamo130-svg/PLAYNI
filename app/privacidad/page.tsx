import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

export const metadata = {
  title: "Política de privacidad | PLAYNI",
  description: "Política de privacidad de PLAYNI.",
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <header className="legal-topbar">
        <Link href="/login" className="legal-back"><ArrowLeft size={17} /> Volver</Link>
        <Link href="/" className="legal-brand" aria-label="PLAYNI">
          <img src="https://raw.githubusercontent.com/jacksonjacamo130-svg/PLAYNI/main/logo-playni.png" alt="PLAYNI" />
        </Link>
      </header>

      <article className="legal-card">
        <div className="legal-kicker"><LockKeyhole size={15} /> DATOS Y PRIVACIDAD</div>
        <h1>Política de privacidad</h1>
        <p className="legal-updated">Última actualización: 27 de septiembre de 2026</p>

        <section><h2>1. Qué cubre esta política</h2>
          <p>Esta Política de Privacidad explica qué información puede recopilar PLAYNI, para qué la utiliza, cuándo puede compartirla con proveedores necesarios para prestar el servicio y qué opciones tienes sobre tus datos.</p>
        </section>

        <section><h2>2. Información que proporcionas</h2>
          <p>Dependiendo de las funciones que utilices, PLAYNI puede recibir datos como nombre, fecha de nacimiento, género, país, número de teléfono, correo electrónico y credenciales necesarias para la cuenta. Las contraseñas se gestionan mediante el sistema de autenticación correspondiente y no deben almacenarse en texto plano por PLAYNI.</p>
        </section>

        <section><h2>3. Información de uso y seguridad</h2>
          <p>Para operar la plataforma, mantener la seguridad y procesar ofertas, PLAYNI puede tratar información relacionada con sesiones, actividad de la cuenta, ofertas iniciadas, tareas, conversiones, recompensas, retiros y eventos técnicos necesarios para detectar errores o abuso.</p>
          <p>Los proveedores externos de ofertas pueden recopilar datos técnicos y de atribución de acuerdo con sus propias políticas y con las condiciones de cada campaña.</p>
        </section>

        <section><h2>4. Para qué utilizamos la información</h2>
          <ul>
            <li>Crear y administrar tu cuenta.</li>
            <li>Autenticar el acceso y proteger la cuenta.</li>
            <li>Mostrar ofertas disponibles y registrar el estado de tareas.</li>
            <li>Procesar, verificar y contabilizar recompensas y retiros.</li>
            <li>Detectar fraude, abuso, duplicidad de cuentas y actividad no autorizada.</li>
            <li>Resolver incidencias, prestar soporte y mejorar la estabilidad de PLAYNI.</li>
            <li>Cumplir obligaciones legales cuando correspondan.</li>
          </ul>
        </section>

        <section><h2>5. Proveedores y servicios externos</h2>
          <p>PLAYNI puede utilizar proveedores tecnológicos y de ofertas para autenticación, infraestructura, almacenamiento, procesamiento, atribución y campañas de recompensas. Solo se comparte la información necesaria para la finalidad correspondiente y estos terceros pueden aplicar sus propias políticas de privacidad.</p>
          <p>Cuando una oferta provenga de un proveedor externo, revisa también sus condiciones y política de privacidad antes de participar.</p>
        </section>

        <section><h2>6. Seguridad</h2>
          <p>Aplicamos medidas razonables de seguridad para proteger la información de la cuenta. Sin embargo, ningún servicio conectado a Internet puede garantizar una seguridad absoluta. Debes mantener tus credenciales privadas y avisar mediante soporte si detectas actividad no autorizada.</p>
        </section>

        <section><h2>7. Conservación</h2>
          <p>Conservamos la información durante el tiempo necesario para proporcionar PLAYNI, mantener registros de seguridad y recompensas, resolver disputas y cumplir obligaciones legales aplicables. El periodo puede variar según el tipo de dato y su finalidad.</p>
        </section>

        <section><h2>8. Tus opciones</h2>
          <p>Dependiendo de la legislación aplicable, puedes solicitar información sobre tus datos, pedir correcciones o plantear solicitudes relacionadas con su tratamiento. Algunas solicitudes pueden requerir verificar que eres el titular de la cuenta. Utiliza los canales de soporte disponibles en PLAYNI.</p>
        </section>

        <section><h2>9. Menores</h2>
          <p>PLAYNI está destinado a personas de 18 años o más. No debes crear una cuenta si eres menor de edad.</p>
        </section>

        <section><h2>10. Enlaces y terceros</h2>
          <p>PLAYNI puede dirigir a aplicaciones, sitios web o campañas de terceros. Una vez que sales de PLAYNI, el tratamiento de datos se rige por las políticas del tercero correspondiente.</p>
        </section>

        <section><h2>11. Cambios a esta política</h2>
          <p>Podemos actualizar esta política para reflejar cambios en PLAYNI, proveedores, procesos o requisitos legales. Publicaremos la versión vigente dentro de la plataforma e indicaremos su fecha de actualización.</p>
        </section>

        <section><h2>12. Contacto y soporte</h2>
          <p>Para solicitudes de privacidad, seguridad o cuenta, utiliza los canales de soporte que PLAYNI ponga a disposición dentro de la plataforma.</p>
        </section>

        <div className="legal-footer-links">
          <Link href="/terminos">Leer Términos y Condiciones</Link>
          <Link href="/login">Volver a PLAYNI</Link>
        </div>
      </article>
    </main>
  );
}
