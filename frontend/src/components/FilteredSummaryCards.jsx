function FilteredSummaryCards({
  isLoading,
  filteredRecords,
  filteredAverageTemperature,
  filteredTotalPrecipitation,
  filteredMaxWindSpeed,
}) {
  return (
    <section className="dashboard-grid compact-grid">
      <article className="card">
        <span className="card-label">Registros filtrados</span>
        <strong>{isLoading ? '...' : filteredRecords}</strong>
        <p>Total de linhas retornadas pelos filtros aplicados.</p>
      </article>

      <article className="card">
        <span className="card-label">Temperatura média filtrada</span>
        <strong>
          {isLoading ? '...' : `${filteredAverageTemperature.toFixed(1)}°C`}
        </strong>
        <p>Média de temperatura no recorte selecionado.</p>
      </article>

      <article className="card">
        <span className="card-label">Chuva total filtrada</span>
        <strong>
          {isLoading ? '...' : `${filteredTotalPrecipitation.toFixed(1)} mm`}
        </strong>
        <p>Soma de precipitação no período filtrado.</p>
      </article>

      <article className="card">
        <span className="card-label">Maior vento filtrado</span>
        <strong>
          {isLoading ? '...' : `${filteredMaxWindSpeed.toFixed(1)} km/h`}
        </strong>
        <p>Maior velocidade máxima de vento no recorte.</p>
      </article>
    </section>
  )
}

export default FilteredSummaryCards
