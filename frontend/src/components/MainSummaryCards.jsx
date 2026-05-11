function MainSummaryCards({
  isLoading,
  totalCities,
  totalDays,
  highestAverageTemperature,
}) {
  return (
    <section className="dashboard-grid">
      <article className="card">
        <span className="card-label">Cidades monitoradas</span>
        <strong>{isLoading ? '...' : totalCities}</strong>
        <p>Regiões brasileiras disponíveis para análise.</p>
      </article>

      <article className="card">
        <span className="card-label">Registros analisados</span>
        <strong>{isLoading ? '...' : totalDays}</strong>
        <p>Dias carregados no banco a partir da Open-Meteo.</p>
      </article>

      <article className="card">
        <span className="card-label">Maior temperatura média</span>
        <strong>
          {isLoading ? '...' : `${highestAverageTemperature.toFixed(1)}°C`}
        </strong>
        <p>Maior média de temperatura entre as cidades.</p>
      </article>
    </section>
  )
}

export default MainSummaryCards
