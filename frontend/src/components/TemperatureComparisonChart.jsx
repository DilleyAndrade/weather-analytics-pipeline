import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function TemperatureComparisonChart({ data }) {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="city" />
          <YAxis unit="°C" />
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(1)}°C`, 'Temperatura média']}
          />
          <Bar
            dataKey="avg_temperature_mean_celsius"
            name="Temperatura média"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TemperatureComparisonChart