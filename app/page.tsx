import Image from "next/image";
import { Gamepad2, Gift, Home, User, WalletCards, Flame, ChevronRight, Coins, Clock3, ShieldCheck, Sparkles } from "lucide-react";

const offers = [
  { title: "MONOPOLY GO!", category: "Tablero", reward: "$12.40", goal: "Alcanza el nivel 10", icon: "🎲" },
  { title: "Coin Master", category: "Estrategia", reward: "$9.80", goal: "Completa la aldea 5", icon: "🪙" },
  { title: "Royal Match", category: "Puzzle", reward: "$8.50", goal: "Completa 100 niveles", icon: "👑" },
  { title: "Domino Dreams", category: "Casual", reward: "$7.20", goal: "Alcanza el nivel 15", icon: "🁫" },
  { title: "Travel Town", category: "Merge", reward: "$11.60", goal: "Llega al nivel 20", icon: "🏝️" },
  { title: "Dice Dreams", category: "Estrategia", reward: "$10.30", goal: "Completa 5 aldeas", icon: "🎲" },
];

export default function HomePage() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <Image src="/logo-playni.png" alt="PLAYNI" width={42} height={42} priority />
          <span>PLAYNI</span>
        </div>
        <button className="balance" aria-label="Ver saldo"><Coins size={17} /><strong>$0.00</strong></button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={14} /> GANA JUGANDO</span>
          <h1>Tu próxima<br /><span>recompensa</span><br />empieza aquí.</h1>
          <p>Elige un juego, completa objetivos y mira cómo tus ganancias aumentan paso a paso.</p>
          <div className="hero-actions">
            <button className="primary-btn">EXPLORAR JUEGOS <ChevronRight size={18} /></button>
            <span className="trust"><ShieldCheck size={15} /> Sin costo para empezar</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-glow" />
          <div className="phone">
            <div className="phone-top"><span>PLAYNI</span><Coins size={15} /></div>
            <div className="phone-balance">$0.00</div>
            <div className="phone-card"><span>🎮</span><div><b>Juega y gana</b><small>Completa objetivos</small></div></div>
            <div className="phone-card"><span>🟡</span><div><b>Recompensas</b><small>Retira cuando cumplas</small></div></div>
          </div>
          <div className="coin coin-a">₱</div><div className="coin coin-b">★</div><div className="coin coin-c">$</div>
        </div>
      </section>

      <section className="quick-stats">
        <div><span>💰</span><b>Saldo</b><strong>$0.00</strong></div>
        <div><span>🎮</span><b>Jugando</b><strong>0 ofertas</strong></div>
        <div><span>🎁</span><b>Ganado</b><strong>$0.00</strong></div>
      </section>

      <section className="section">
        <div className="section-head">
          <div><span className="eyebrow">PARA TI</span><h2>Empieza a ganar</h2></div>
          <a href="#">Ver todas <ChevronRight size={16} /></a>
        </div>
        <div className="game-grid">
          {offers.map((offer) => (
            <article className="game-card" key={offer.title}>
              <div className="game-cover">
                <span className="game-icon">{offer.icon}</span>
                <span className="offer-badge">HASTA {offer.reward}</span>
              </div>
              <div className="game-info">
                <span className="tag">{offer.category}</span>
                <h3>{offer.title}</h3>
                <p><Clock3 size={14} /> {offer.goal}</p>
                <button>VER OFERTA <ChevronRight size={16} /></button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="how">
        <div className="how-head"><span className="eyebrow">MUY FÁCIL</span><h2>Así funciona</h2></div>
        <div className="steps">
          <div><span>01</span><h3>Elige</h3><p>Encuentra una oferta que te interese.</p></div>
          <div><span>02</span><h3>Juega</h3><p>Instala desde PLAYNI y completa sus objetivos.</p></div>
          <div><span>03</span><h3>Gana</h3><p>Tu recompensa aparece cuando el objetivo es validado.</p></div>
          <div><span>04</span><h3>Retira</h3><p>Solicita tu recompensa desde tu billetera.</p></div>
        </div>
      </section>

      <section className="daily">
        <div className="daily-icon">🎁</div>
        <div><strong>Bono diario</strong><p>Vuelve cada día para descubrir nuevas oportunidades.</p></div>
        <button>VER BONO</button>
      </section>

      <nav className="bottom-nav">
        <a className="active"><Home size={21} /><span>Inicio</span></a>
        <a><Gamepad2 size={21} /><span>Juegos</span></a>
        <a><Gift size={21} /><span>Premios</span></a>
        <a><WalletCards size={21} /><span>Billetera</span></a>
        <a><User size={21} /><span>Perfil</span></a>
      </nav>
    </main>
  );
}