import StatusMessage from './StatusMessage'

function DailyWeatherTable({ data = [] }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Cidade</th>
            <th>Temp. média</th>
            <th>Temp. máx.</th>
            <th>Temp. mín.</th>
            <th>Chuva</th>
            <th>Vento</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={`${item.location_id}-${item.date}`}>
              <td>{item.date}</td>
              <td>{item.city}</td>
              <td>{Number(item.temperature_mean_celsius).toFixed(1)}°C</td>
              <td>{Number(item.temperature_max_celsius).toFixed(1)}°C</td>
              <td>{Number(item.temperature_min_celsius).toFixed(1)}°C</td>
              <td>{Number(item.precipitation_sum_mm).toFixed(1)} mm</td>
              <td>{Number(item.wind_speed_max_kmh).toFixed(1)} km/h</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <StatusMessage>
          Nenhum dado diário encontrado.
        </StatusMessage>
      )}
    </div>
  )
}

export default DailyWeatherTable
