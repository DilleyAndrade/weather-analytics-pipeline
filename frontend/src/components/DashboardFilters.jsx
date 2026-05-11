function DashboardFilters({
  locations,
  selectedLocationId,
  selectedMetric,
  startDate,
  endDate,
  onLocationChange,
  onMetricChange,
  onStartDateChange,
  onEndDateChange,
  onApplyFilters,
  onClearFilters,
}) {
  return (
    <section className="filters-section">
      <div className="section-header">
        <h2>Filtros</h2>
        <p>Selecione uma cidade, variável climática e período para análise.</p>
      </div>

      <div className="filters-grid">
        <label>
          Cidade
          <select
            value={selectedLocationId}
            onChange={(event) => onLocationChange(event.target.value)}
          >
            <option value="">Todas as cidades</option>
            {locations.map((location) => (
              <option key={location.location_id} value={location.location_id}>
                {location.city}
              </option>
            ))}
          </select>
        </label>

        <label>
          Variável
          <select
            value={selectedMetric}
            onChange={(event) => onMetricChange(event.target.value)}
          >
            <option value="temperature_mean_celsius">Temperatura média</option>
            <option value="precipitation_sum_mm">Precipitação</option>
            <option value="wind_speed_max_kmh">Vento máximo</option>
          </select>
        </label>

        <label>
          Data inicial
          <input
            type="date"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
          />
        </label>

        <label>
          Data final
          <input
            type="date"
            value={endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
          />
        </label>

        <div className="filter-actions">
          <button type="button" onClick={onApplyFilters}>
            Aplicar filtros
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={onClearFilters}
          >
            Limpar
          </button>
        </div>
      </div>
    </section>
  )
}

export default DashboardFilters