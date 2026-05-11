import { useEffect, useState } from 'react'
import './App.css'
import DailyTemperatureLineChart from './components/DailyTemperatureLineChart'
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

  const [selectedMetric, setSelectedMetric] = useState('temperature_mean_celsius')

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

  async function clearFilters() {
    setSelectedLocationId('')
    setSelectedMetric('temperature_mean_celsius')
    setStartDate('2025-01-01')
    setEndDate('2025-01-07')

    try {
      setIsDailyLoading(true)

      const data = await getDailyWeather({
        start_date: '2025-01-01',
        end_date: '2025-01-07',
        limit: 1000,
      })

      setDailyWeather(data)
    } catch (error) {
      console.error(error)
      setErrorMessage('Não foi possível limpar os filtros.')
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

  const filteredRecords = dailyWeather.length

  const filteredAverageTemperature =
    dailyWeather.length > 0
      ? dailyWeather.reduce(
          (acc, item) => acc + Number(item.temperature_mean_celsius),
          0,
        ) / dailyWeather.length
      : 0

  const filteredTotalPrecipitation = dailyWeather.reduce(
    (acc, item) => acc + Number(item.precipitation_sum_mm),
    0,
  )

  const filteredMaxWindSpeed = dailyWeather.reduce((maxWind, item) => {
    const currentWindSpeed = Number(item.wind_speed_max_kmh)

    if (currentWindSpeed > maxWind) {
      return currentWindSpeed
    }

    return maxWind
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

      <section className="dashboard-grid compact-grid">
        <article className="card">
          <span className="card-label">Registros filtrados</span>
          <strong>{isDailyLoading ? '...' : filteredRecords}</strong>
          <p>Total de linhas retornadas pelos filtros aplicados.</p>
        </article>

        <article className="card">
          <span className="card-label">Temperatura média filtrada</span>
          <strong>
            {isDailyLoading ? '...' : `${filteredAverageTemperature.toFixed(1)}°C`}
          </strong>
          <p>Média de temperatura no recorte selecionado.</p>
        </article>

        <article className="card">
          <span className="card-label">Chuva total filtrada</span>
          <strong>
            {isDailyLoading ? '...' : `${filteredTotalPrecipitation.toFixed(1)} mm`}
          </strong>
          <p>Soma de precipitação no período filtrado.</p>
        </article>

        <article className="card">
          <span className="card-label">Maior vento filtrado</span>
          <strong>
            {isDailyLoading ? '...' : `${filteredMaxWindSpeed.toFixed(1)} km/h`}
          </strong>
          <p>Maior velocidade máxima de vento no recorte.</p>
        </article>
      </section>

      <DashboardFilters
        locations={locations}
        selectedLocationId={selectedLocationId}
        selectedMetric={selectedMetric}
        startDate={startDate}
        endDate={endDate}
        onLocationChange={setSelectedLocationId}
        onMetricChange={setSelectedMetric}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onApplyFilters={fetchDailyWeather}
        onClearFilters={clearFilters}
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
          <h2>Evolução diária da variável climática</h2>
          <p>Selecione uma cidade e uma variável para visualizar a evolução diária.</p>
        </div>

        {!selectedLocationId ? (
          <p className="empty-state">
            Escolha uma cidade nos filtros para exibir o gráfico de evolução diária.
          </p>
        ) : isDailyLoading ? (
          <p className="empty-state">Carregando gráfico diário...</p>
        ) : (
          <DailyTemperatureLineChart
            data={dailyWeather}
            metric={selectedMetric}
          />
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
