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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis unit={currentMetric.unit} />
          <Tooltip
            formatter={(value) => [
              `${Number(value).toFixed(1)}${currentMetric.unit}`,
              currentMetric.label,
            ]}
          />
          <Line
            type="monotone"
            dataKey={metric}
            name={currentMetric.label}
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