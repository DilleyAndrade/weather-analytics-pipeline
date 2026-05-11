function DashboardFilters({
  locations,
  selectedLocationId,
  startDate,
  endDate,
  onLocationChange,
  onStartDateChange,
  onEndDateChange,
  onApplyFilters,
}) {
  return (
    <section className="filters-section">
      <div className="section-header">
        <h2>Filtros</h2>
        <p>Selecione uma cidade e um período para analisar os dados diários.</p>
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

        <button type="button" onClick={onApplyFilters}>
          Aplicar filtros
        </button>
      </div>
    </section>
  )
}

export default DashboardFilters
