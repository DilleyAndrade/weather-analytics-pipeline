import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const metricConfig = {
  temperature_mean_celsius: {
    label: 'Temperatura média',
    unit: '°C',
  },
  precipitation_sum_mm: {
    label: 'Precipitação',
    unit: ' mm',
  },
  wind_speed_max_kmh: {
    label: 'Vento máximo',
    unit: ' km/h',
  },
}

function DailyTemperatureLineChart({
  data = [],
  metric = 'temperature_mean_celsius',
}) {
  const currentMetric = metricConfig[metric]

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="var(--text-secondary)" />
          <YAxis stroke="var(--text-secondary)" unit={currentMetric.unit} />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)',
              borderRadius: '14px',
              boxShadow: 'var(--chart-tooltip-shadow)',
              color: 'var(--text-primary)',
            }}
            formatter={(value) => [
              `${Number(value).toFixed(1)}${currentMetric.unit}`,
              currentMetric.label,
            ]}
          />
          <Line
            type="monotone"
            dataKey={metric}
            name={currentMetric.label}
            stroke="var(--chart-secondary)"
            strokeWidth={3}
            dot={{ fill: 'var(--bg-secondary)', r: 4, strokeWidth: 2 }}
            activeDot={{ fill: 'var(--chart-secondary)', r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DailyTemperatureLineChart
