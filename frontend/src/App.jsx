import { useEffect, useState } from 'react'
import './App.css'
import CitySummaryTable from './components/CitySummaryTable'
import DailyTemperatureLineChart from './components/DailyTemperatureLineChart'
import DailyWeatherTable from './components/DailyWeatherTable'
import DashboardFilters from './components/DashboardFilters'
import FilteredSummaryCards from './components/FilteredSummaryCards'
import MainSummaryCards from './components/MainSummaryCards'
import TemperatureComparisonChart from './components/TemperatureComparisonChart'
import StatusMessage from './components/StatusMessage'
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
  const [selectedMetric, setSelectedMetric] = useState('temperature_mean_celsius')
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

  const totalDays = summary.reduce(
    (acc, item) => acc + Number(item.total_days),
    0,
  )

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
        <StatusMessage type="error">
          {errorMessage}
        </StatusMessage>
      )}

      <MainSummaryCards
        isLoading={isLoading}
        totalCities={totalCities}
        totalDays={totalDays}
        highestAverageTemperature={highestAverageTemperature}
      />

      <FilteredSummaryCards
        isLoading={isDailyLoading}
        filteredRecords={filteredRecords}
        filteredAverageTemperature={filteredAverageTemperature}
        filteredTotalPrecipitation={filteredTotalPrecipitation}
        filteredMaxWindSpeed={filteredMaxWindSpeed}
      />

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
          <StatusMessage type="loading">
            Carregando gráfico...
          </StatusMessage>
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
          <StatusMessage>
            Escolha uma cidade nos filtros para exibir o gráfico de evolução diária.
          </StatusMessage>
        ) : isDailyLoading ? (
          <StatusMessage type="loading">
            Carregando gráfico diário...
          </StatusMessage>
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
          <StatusMessage type="loading">
            Carregando dados diários...
          </StatusMessage>
        ) : (
          <DailyWeatherTable data={dailyWeather} />
        )}
      </section>

      <CitySummaryTable
        summary={summary}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </main>
  )
}

export default App