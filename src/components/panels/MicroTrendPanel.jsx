import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MICRO_TREND, getTrendColor } from '../../data/microTrend';

/**
 * MicroTrendPanel — Three 30-minute sparklines
 * Title: "Last 30 Minutes — Rate of Change"
 */
export default function MicroTrendPanel({ scenarioKey }) {
  const trend = MICRO_TREND[scenarioKey];
  const riskColor =
    scenarioKey === 'CRITICAL' ? '#ef4444' :
    scenarioKey === 'WARNING'  ? '#f97316' :
    scenarioKey === 'WATCH'    ? '#eab308' : '#22c55e';

  // Build recharts-compatible data arrays
  const buildData = (arr) =>
    trend.timestamps.map((t, i) => ({ time: t, value: arr[i] }));

  const charts = [
    {
      id: 'rainfall',
      label: '🌧 Rainfall',
      unit: 'mm/hr',
      data: buildData(trend.rainfall),
      direction: trend.direction.rainfall,
      dirLabel: trend.directionLabel.rainfall,
      color: '#60a5fa',
    },
    {
      id: 'soil',
      label: '💧 Soil Saturation',
      unit: '%',
      data: buildData(trend.soil),
      direction: trend.direction.soil,
      dirLabel: trend.directionLabel.soil,
      color: '#a78bfa',
    },
    {
      id: 'stream',
      label: '🌊 Stream Level',
      unit: 'm',
      data: buildData(trend.stream),
      direction: trend.direction.stream,
      dirLabel: trend.directionLabel.stream,
      color: '#34d399',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {charts.map(chart => (
        <SparklineCard key={chart.id} chart={chart} riskColor={riskColor} scenarioKey={scenarioKey} />
      ))}
    </div>
  );
}

function SparklineCard({ chart, riskColor, scenarioKey }) {
  const dirColor = getTrendColor(chart.direction);

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ fontSize: '10px', color: 'var(--color-muted-bright)', fontWeight: 600 }}>
          {chart.label}
        </span>
        <span style={{ fontSize: '10px', fontWeight: 700, color: dirColor }}>
          {chart.dirLabel}
        </span>
      </div>

      {/* Sparkline */}
      <div style={{ height: '42px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chart.data} margin={{ top: 2, right: 2, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${chart.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chart.color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={chart.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip
              contentStyle={{
                background: '#0a0f1e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
                fontSize: 10,
                color: '#f1f5f9',
                padding: '3px 8px',
              }}
              formatter={(v) => [`${v} ${chart.unit}`, chart.label]}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={chart.color}
              strokeWidth={2}
              fill={`url(#grad-${chart.id})`}
              dot={false}
              animationDuration={600}
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Latest value row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1px' }}>
        <span style={{ fontSize: '9px', color: 'var(--color-muted)' }}>
          {chart.data[0].time} → {chart.data[chart.data.length - 1].time}
        </span>
        <span style={{ fontSize: '10px', fontWeight: 700, color: chart.color, fontVariantNumeric: 'tabular-nums' }}>
          {chart.data[chart.data.length - 1].value} {chart.unit}
        </span>
      </div>
    </div>
  );
}
