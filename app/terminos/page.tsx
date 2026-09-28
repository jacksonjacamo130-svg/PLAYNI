import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Términos y condiciones | PLAYNI",
  description: "Términos y condiciones de uso de PLAYNI.",
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <header className="legal-topbar">
        <Link href="/login" className="legal-back"><ArrowLeft size={17} /> Volver</Link>
        <Link href="/" className="legal-brand" aria-label="PLAYNI">
          <img src="https://raw.githubusercontent.com/jacksonjacamo130-svg/PLAYNI/main/logo-playni.png" alt="PLAYNI" />
        </Link>
      </header>

      <article className="legal-card">
        <div className="legal-kicker"><ShieldCheck size={15} /> DOCUMENTO OFICIAL</div>
        <h1>Términos y condiciones</h1>
        <p className="legal-updated">Última actualización: 27 de septiembre de 2026</p>

        <section><h2>1. Aceptación</h2>
          <p>Estos Términos y Condiciones regulan el acceso y uso de PLAYNI. Al crear una cuenta, acceder o utilizar PLAYNI, confirmas que has leído y aceptas estas reglas. Si no estás de acuerdo, no debes utilizar la plataforma.</p>
        </section>

        <section><h2>2. Requisitos para usar PLAYNI</h2>
          <p>Debes tener al menos 18 años y proporcionar información correcta, actualizada y suficiente para operar tu cuenta. PLAYNI puede solicitar verificaciones adicionales cuando sean necesarias para seguridad, cumplimiento, soporte o procesamiento de recompensas.</p>
        </section>

        <section><h2>3. Cuenta personal</h2>
          <p>Tu cuenta es personal. No debes venderla, alquilarla, transferirla ni permitir que otra persona la utilice para generar recompensas. Cada persona debe mantener una sola cuenta, salvo que PLAYNI autorice expresamente una excepción.</p>
        </section>

        <section><h2>4. Ofertas, juegos y tareas</h2>
          <p>PLAYNI puede mostrar juegos, aplicaciones, encuestas, registros y otras campañas de proveedores externos. Cada oferta puede tener condiciones específicas de elegibilidad, instalación, tiempo, nivel, compra o finalización.</p>
          <p>Debes leer y cumplir las condiciones de cada oferta antes de iniciarla. Completar una actividad no garantiza por sí mismo que una recompensa sea aprobada: el proveedor debe poder verificar la conversión conforme a sus sistemas y reglas.</p>
        </section>

        <section><h2>5. Uso limpio y prohibición de fraude</h2>
          <p>Para proteger PLAYNI, a sus usuarios y a los proveedores de ofertas, está prohibido intentar manipular el sistema o generar recompensas de manera artificial. Entre otras conductas, no está permitido:</p>
          <ul>
            <li>Usar VPN, proxy, sistemas de ocultación o métodos similares para falsear o alterar la ubicación, identidad del tráfico o elegibilidad de una oferta.</li>
            <li>Crear, controlar o utilizar múltiples cuentas para obtener recompensas, promociones o beneficios más de una vez.</li>
            <li>Restablecer de fábrica, cambiar, clonar o manipular un dispositivo con el propósito de evadir identificadores, límites, restricciones o requisitos de una oferta.</li>
            <li>Usar aplicaciones modificadas, versiones MOD/APK alteradas, herramientas de inyección o cualquier modificación destinada a alterar una aplicación o su progreso.</li>
            <li>Usar bots, scripts, macros, automatizaciones, emuladores u otros mecanismos para completar tareas de forma no permitida.</li>
            <li>Usar datos falsos, documentos falsificados, información de terceros o métodos de pago/retiro que no te pertenezcan.</li>
            <li>Intentar completar una oferta más de una vez cuando sus condiciones indiquen que es de participación única o para nuevos usuarios.</li>
            <li>Manipular enlaces, eventos, identificadores, aplicaciones, dispositivos, conversiones o cualquier dato con el objetivo de obtener una recompensa indebida.</li>
          </ul>
          <p>Restablecer un dispositivo por una razón personal o técnica no constituye por sí mismo una infracción; el problema es utilizarlo deliberadamente para evadir controles o volver a obtener beneficios que no corresponden.</p>
        </section>

        <section><h2>6. Recompensas y monedas</h2>
          <p>Las monedas de PLAYNI son unidades de recompensa dentro de la plataforma. Su disponibilidad, valor, acreditación y posibilidad de retiro dependen de las reglas vigentes, del tipo de oferta y de la confirmación de los proveedores correspondientes.</p>
          <p>Una recompensa puede quedar pendiente, ser ajustada o ser anulada cuando una conversión sea rechazada, cancelada, reversada, no pueda verificarse o se determine que no cumplió las condiciones de la oferta.</p>
        </section>

        <section><h2>7. Retiros</h2>
          <p>Los retiros están sujetos a los métodos, mínimos, requisitos de verificación y condiciones que PLAYNI muestre en ese momento. Una solicitud puede ser revisada antes de ser aprobada. Si una recompensa asociada a un retiro se determina inválida, PLAYNI puede retener, ajustar o rechazar la solicitud conforme a estas condiciones.</p>
        </section>

        <section><h2>8. Proveedores externos</h2>
          <p>Las ofertas pueden ser operadas o verificadas por terceros. Estos proveedores pueden tener sus propios términos, políticas y mecanismos antifraude. PLAYNI no controla todas sus decisiones de seguimiento, elegibilidad, aprobación o rechazo, y una campaña puede cambiar o dejar de estar disponible.</p>
        </section>

        <section><h2>9. Revisión y seguridad</h2>
          <p>PLAYNI puede revisar actividad, conversiones y cuentas cuando existan señales de fraude, abuso, duplicidad o incumplimiento. Cuando sea necesario, una recompensa o retiro puede permanecer en revisión mientras se obtiene información adicional.</p>
        </section>

        <section><h2>10. Suspensión o cierre de cuenta</h2>
          <p>PLAYNI puede restringir, suspender o cerrar una cuenta cuando exista incumplimiento de estos términos, actividad fraudulenta, abuso de ofertas, riesgo de seguridad o información engañosa. Cuando sea razonablemente posible, se aplicarán medidas proporcionales al caso y podrán revisarse mediante los canales de soporte disponibles.</p>
        </section>

        <section><h2>11. Disponibilidad del servicio</h2>
          <p>PLAYNI busca mantener el servicio disponible, pero no garantiza que todas las ofertas, juegos, recompensas o funciones estén disponibles permanentemente para todos los usuarios, países, dispositivos o momentos.</p>
        </section>

        <section><h2>12. Cambios en PLAYNI</h2>
          <p>Podemos actualizar funciones, campañas, requisitos y estos términos cuando sea necesario. La versión vigente se mostrará dentro de PLAYNI. El uso continuado de la plataforma después de una actualización implica la aceptación de la versión aplicable, en la medida permitida por la ley.</p>
        </section>

        <section><h2>13. Limitaciones</h2>
          <p>PLAYNI no garantiza una cantidad concreta de ingresos, ofertas o recompensas. Nada de estos términos pretende excluir derechos que no puedan ser limitados conforme a la legislación aplicable.</p>
        </section>

        <section><h2>14. Soporte</h2>
          <p>Para consultas sobre cuentas, ofertas, recompensas, retiros o seguridad, utiliza los canales de soporte que PLAYNI ponga a disposición dentro de la plataforma.</p>
        </section>

        <div className="legal-footer-links">
          <Link href="/privacidad">Leer Política de Privacidad</Link>
          <Link href="/login">Volver a PLAYNI</Link>
        </div>
      </article>
    </main>
  );
}
