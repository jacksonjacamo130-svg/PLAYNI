import { Gamepad2, Gift, Home, User, WalletCards, Flame, ChevronRight, Coins } from "lucide-react";

const games = [
  { title: "Domino Dreams", category: "Casual", reward: "Hasta 18,500", icon: "🁫", progress: 0 },
  { title: "Coin Master", category: "Estrategia", reward: "Hasta 25,000", icon: "🪙", progress: 0 },
  { title: "Travel Town", category: "Puzzle", reward: "Hasta 21,000", icon: "🏝️", progress: 0 }
];

export default function HomePage() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">P</span><span>PLAYNI</span></div>
        <div className="balance"><Coins size={17} /> <strong>0</strong> monedas</div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Flame size={15} /> NUEVO EN PLAYNI</span>
          <h1>Juega.<br /><span>Completa.</span><br />Gana monedas.</h1>
          <p>Descubre juegos, completa objetivos y convierte tu tiempo de juego en recompensas.</p>
          <button className="primary-btn">VER JUEGOS <ChevronRight size={18} /></button>
        </div>
        <div className="hero-art">
          <div className="coin coin-a">₱</div><div className="coin coin-b">★</div><div className="coin coin-c">P</div>
          <div className="phone"><Gamepad2 size={72} /><span>PLAYNI</span></div>
        </div>
      </section>

      <section className="daily">
        <div className="daily-icon">🎁</div>
        <div><strong>Bono diario</strong><p>Entra cada día y reclama tus monedas gratis.</p></div>
        <button>RECLAMAR</button>
      </section>

      <section className="section">
        <div className="section-head"><div><span className="eyebrow">DESTACADOS</span><h2>Juegos para ti</h2></div><a href="#">Ver todos <ChevronRight size={16} /></a></div>
        <div className="game-grid">
          {games.map((game) => (
            <article className="game-card" key={game.title}>
              <div className="game-cover"><span>{game.icon}</span><b>PLAY</b></div>
              <div className="game-info"><span className="tag">{game.category}</span><h3>{game.title}</h3><p>Recompensa <strong>{game.reward}</strong> monedas</p><button>JUGAR Y GANAR <ChevronRight size={16} /></button></div>
            </article>
          ))}
        </div>
      </section>

      <section className="steps">
        <div><span>01</span><h3>Elige un juego</h3><p>Encuentra una oferta que te guste.</p></div>
        <div><span>02</span><h3>Completa objetivos</h3><p>Juega y alcanza las metas.</p></div>
        <div><span>03</span><h3>Gana y retira</h3><p>Convierte tus monedas en recompensas.</p></div>
      </section>

      <nav className="bottom-nav">
        <a className="active"><Home size={21} /><span>Inicio</span></a>
        <a><Gamepad2 size={21} /><span>Juegos</span></a>
        <a><Gift size={21} /><span>Recompensas</span></a>
        <a><WalletCards size={21} /><span>Retirar</span></a>
        <a><User size={21} /><span>Perfil</span></a>
      </nav>
    </main>
  );
}