import { useEffect, useState } from 'react'
import './App.css'
import CitySummaryTable from './components/CitySummaryTable'
import DailyTemperatureLineChart from './components/DailyTemperatureLineChart'
import DailyWeatherTable from './components/DailyWeatherTable'
import DashboardFilters from './components/DashboardFilters'
import FilteredSummaryCards from './components/FilteredSummaryCards'
import LoginScreen from './components/LoginScreen'
import MainSummaryCards from './components/MainSummaryCards'
import TemperatureComparisonChart from './components/TemperatureComparisonChart'
import StatusMessage from './components/StatusMessage'
import ThemeToggle from './components/ThemeToggle'
import {
  getDailyWeather,
  getWeatherComparison,
  getWeatherLocations,
  getWeatherSummary,
  loginDashboardUser,
} from './services/api'

const INITIAL_START_DATE = '2025-01-01'
const INITIAL_END_DATE = '2025-01-07'

function getLatestDate(items, fieldName) {
  return items.reduce((latestDate, item) => {
    const currentDate = item[fieldName]

    if (!currentDate || currentDate <= latestDate) {
      return latestDate
    }

    return currentDate
  }, '')
}

function formatDate(date) {
  if (!date) {
    return 'Indisponível'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00Z`))
}

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('dashboard_user')

    return savedUser ? JSON.parse(savedUser) : null
  })

  const [summary, setSummary] = useState([])
  const [comparison, setComparison] = useState([])
  const [locations, setLocations] = useState([])
  const [dailyWeather, setDailyWeather] = useState([])

  const [selectedLocationId, setSelectedLocationId] = useState('')
  const [selectedMetric, setSelectedMetric] = useState('temperature_mean_celsius')
  const [startDate, setStartDate] = useState(INITIAL_START_DATE)
  const [endDate, setEndDate] = useState(INITIAL_END_DATE)

  const [isLoading, setIsLoading] = useState(true)
  const [isDailyLoading, setIsDailyLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleLogin(credentials) {
    try {
      const loggedUser = await loginDashboardUser(credentials)

      localStorage.setItem('dashboard_user', JSON.stringify(loggedUser))
      setCurrentUser(loggedUser)

      return {
        success: true,
      }
    } catch (error) {
      console.error(error)

      return {
        message: 'Login ou senha incorretos. Verifique os dados e tente novamente.',
        success: false,
      }
    }
  }

  function handleLogout() {
    localStorage.removeItem('dashboard_user')
    setCurrentUser(null)
  }

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
    setStartDate(INITIAL_START_DATE)
    setEndDate(INITIAL_END_DATE)

    try {
      setIsDailyLoading(true)

      const data = await getDailyWeather({
        start_date: INITIAL_START_DATE,
        end_date: INITIAL_END_DATE,
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
    if (!currentUser) {
      return
    }

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
              start_date: INITIAL_START_DATE,
              end_date: INITIAL_END_DATE,
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
  }, [currentUser])

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

  const latestApiUpdateDate = getLatestDate(summary, 'end_date')

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <main className="app">
      <ThemeToggle />

      <section className="dashboard-topbar" aria-label="Status da API">
        <div>
          <span className="topbar-label">Última data disponível na API</span>
          <strong>
            {isLoading ? 'Carregando...' : formatDate(latestApiUpdateDate)}
          </strong>
        </div>

        <span className={`topbar-badge ${errorMessage ? 'topbar-badge-error' : ''}`}>
          {errorMessage ? 'Falha na conexão' : 'Dados sincronizados'}
        </span>

        <div className="user-session">
          <span>
            {currentUser.name} ({currentUser.role})
          </span>
          <button type="button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </section>

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
