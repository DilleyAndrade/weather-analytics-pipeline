import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function DailyTemperatureLineChart({ data = [] }) {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis unit="°C" />
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(1)}°C`, 'Temperatura média']}
          />
          <Line
            type="monotone"
            dataKey="temperature_mean_celsius"
            name="Temperatura média"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DailyTemperatureLineChart