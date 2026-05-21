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
          <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
          <XAxis dataKey="city" stroke="var(--text-secondary)" />
          <YAxis stroke="var(--text-secondary)" unit="°C" />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)',
              borderRadius: '14px',
              boxShadow: 'var(--chart-tooltip-shadow)',
              color: 'var(--text-primary)',
            }}
            cursor={{ fill: 'var(--bg-tertiary)' }}
            formatter={(value) => [
              `${Number(value).toFixed(1)}°C`,
              'Temperatura média',
            ]}
          />
          <Bar
            dataKey="avg_temperature_mean_celsius"
            fill="var(--chart-primary)"
            name="Temperatura média"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TemperatureComparisonChart
