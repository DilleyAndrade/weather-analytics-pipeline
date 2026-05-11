import './App.css'

function App() {
  return (
    <main className="app">
      <section className="hero">
        <div>
          <p className="eyebrow">Weather Analytics Pipeline</p>
          <h1>Dashboard Meteorológico</h1>
          <p className="subtitle">
            Compare temperatura, precipitação e vento entre diferentes cidades brasileiras.
          </p>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="card">
          <span className="card-label">Cidades monitoradas</span>
          <strong>6</strong>
          <p>Regiões brasileiras disponíveis para análise.</p>
        </article>

        <article className="card">
          <span className="card-label">Período carregado</span>
          <strong>Jan/2025</strong>
          <p>Dados históricos coletados via Open-Meteo.</p>
        </article>

        <article className="card">
          <span className="card-label">Fonte dos dados</span>
          <strong>Open-Meteo</strong>
          <p>Pipeline Python com persistência em PostgreSQL.</p>
        </article>
      </section>

      <section className="placeholder-section">
        <div className="section-header">
          <h2>Visualizações</h2>
          <p>Os gráficos serão conectados à API nas próximas etapas.</p>
        </div>

        <div className="placeholder-chart">
          <p>Área reservada para gráficos comparativos.</p>
        </div>
      </section>
    </main>
  )
}

export default App
