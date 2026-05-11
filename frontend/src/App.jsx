import { useEffect, useState } from 'react'
import './App.css'
import DailyWeatherTable from './components/DailyWeatherTable'
import DashboardFilters from './components/DashboardFilters'
import TemperatureComparisonChart from './components/TemperatureComparisonChart'
import {
  getDailyWeather,
  getWeatherComparison,
  getWeatherLocations,
  getWeatherSummary,
} from './services/api'

function App() {
  const [summary, setSummary] = useState([])
  const [comparison, setComparison] = useState([])
  const [locations, setLocations] = useState([])
  const [dailyWeather, setDailyWeather] = useState([])

  const [selectedLocationId, setSelectedLocationId] = useState('')
  const [startDate, setStartDate] = useState('2025-01-01')
  const [endDate, setEndDate] = useState('2025-01-07')

  const [isLoading, setIsLoading] = useState(true)
  const [isDailyLoading, setIsDailyLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function fetchDailyWeather() {
    try {
      setIsDailyLoading(true)

      const params = {
        start_date: startDate,
        end_date: endDate,
        limit: 1000,
      }

      if (selectedLocationId) {
        params.location_id = selectedLocationId
      }

      const data = await getDailyWeather(params)
      setDailyWeather(data)
    } catch (error) {
      console.error(error)
      setErrorMessage('Não foi possível carregar os dados diários.')
    } finally {
      setIsDailyLoading(false)
    }
  }

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [summaryData, comparisonData, locationsData, dailyData] =
          await Promise.all([
            getWeatherSummary(),
            getWeatherComparison({
              year: 2025,
              month: 1,
            }),
            getWeatherLocations(),
            getDailyWeather({
              start_date: startDate,
              end_date: endDate,
              limit: 1000,
            }),
          ])

        setSummary(summaryData)
        setComparison(comparisonData)
        setLocations(locationsData)
        setDailyWeather(dailyData)
      } catch (error) {
        console.error(error)
        setErrorMessage('Não foi possível carregar os dados da API.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const totalCities = summary.length
  const totalDays = summary.reduce((acc, item) => acc + Number(item.total_days), 0)
  const highestAverageTemperature = summary.reduce((highest, item) => {
    const currentTemperature = Number(item.avg_temperature_mean_celsius)

    if (currentTemperature > highest) {
      return currentTemperature
    }

    return highest
  }, 0)

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

      {errorMessage && (
        <section className="alert">
          <p>{errorMessage}</p>
        </section>
      )}

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

      <DashboardFilters
        locations={locations}
        selectedLocationId={selectedLocationId}
        startDate={startDate}
        endDate={endDate}
        onLocationChange={setSelectedLocationId}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onApplyFilters={fetchDailyWeather}
      />

      <section className="placeholder-section">
        <div className="section-header">
          <h2>Temperatura média por cidade</h2>
          <p>Comparação baseada nos dados agregados de janeiro de 2025.</p>
        </div>

        {isLoading ? (
          <p className="empty-state">Carregando gráfico...</p>
        ) : (
          <TemperatureComparisonChart data={comparison} />
        )}
      </section>

      <section className="placeholder-section">
        <div className="section-header">
          <h2>Dados diários filtrados</h2>
          <p>Dados retornados pela API conforme filtros selecionados.</p>
        </div>

        {isDailyLoading ? (
          <p className="empty-state">Carregando dados diários...</p>
        ) : (
          <DailyWeatherTable data={dailyWeather} />
        )}
      </section>

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
            <p className="empty-state">Nenhum dado encontrado.</p>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
