import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
})

export async function getWeatherSummary() {
  const response = await api.get('/weather/summary')
  return response.data
}

export async function getWeatherComparison(params = {}) {
  const response = await api.get('/weather/comparison', {
    params,
  })

  return response.data
}

export default api