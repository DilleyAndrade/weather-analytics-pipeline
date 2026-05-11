import StatusMessage from './StatusMessage'

function CitySummaryTable({ summary = [], isLoading, errorMessage }) {
  return (
    <section className="placeholder-section">
      <div className="section-header">
        <h2>Resumo por cidade</h2>
        <p>Dados agregados consumidos diretamente da API FastAPI.</p>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Cidade</th>
              <th>Dias</th>
              <th>Temp. média</th>
              <th>Chuva total</th>
              <th>Vento médio</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((item) => (
              <tr key={item.location_id}>
                <td>{item.city}</td>
                <td>{item.total_days}</td>
                <td>{Number(item.avg_temperature_mean_celsius).toFixed(1)}°C</td>
                <td>{Number(item.total_precipitation_mm).toFixed(1)} mm</td>
                <td>{Number(item.avg_wind_speed_max_kmh).toFixed(1)} km/h</td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && summary.length === 0 && !errorMessage && (
          <StatusMessage>
            Nenhum dado encontrado.
          </StatusMessage>
        )}
      </div>
    </section>
  )
}

export default CitySummaryTable
