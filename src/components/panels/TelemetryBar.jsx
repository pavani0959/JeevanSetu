import { MICRO_TREND, getTrendColor } from '../../data/microTrend';

/**
 * TelemetryBar — live sensor readings strip
 * Shows: Rainfall | Soil Saturation | Stream Level | Risk Score
 * Professional text and badge indicators (no informal emojis)
 */
export default function TelemetryBar({ scenarioKey, liveRainfall, liveSoil, liveStream, riskScore, riskState, isHindi }) {
  const trend = MICRO_TREND[scenarioKey];

  const readings = [
    {
      id: 'rainfall',
      label: isHindi ? 'बारिश (Rainfall)' : 'Rainfall Rate',
      value: liveRainfall.toFixed(1),
      unit: 'mm/hr',
      max: 150,
      trend: trend.direction.rainfall,
      trendLabel: trend.directionLabel.rainfall,
      color: severityColor(liveRainfall, 15, 64, 115),
    },
    {
      id: 'soil',
      label: isHindi ? 'मिट्टी में नमी (Soil Moisture)' : 'Soil Saturation',
      value: liveSoil.toFixed(0),
      unit: '%',
      max: 100,
      trend: trend.direction.soil,
      trendLabel: trend.directionLabel.soil,
      color: severityColor(liveSoil, 40, 65, 80),
    },
    {
      id: 'stream',
      label: isHindi ? 'नदी/नाले का जलस्तर (River Stream)' : 'River Stream Level',
      value: liveStream.toFixed(1),
      unit: 'm',
      max: 5,
      trend: trend.direction.stream,
      trendLabel: trend.directionLabel.stream,
      color: severityColor(liveStream, 1.0, 2.0, 3.0),
    },
    {
      id: 'risk',
      label: isHindi ? 'खतरे का स्तर (Risk Score)' : 'Flood Risk Score',
      value: riskScore,
      unit: '/ 100',
      max: 100,
      trend: trend.direction.rainfall,
      trendLabel: null,
      color:
        riskState === 'CRITICAL' ? '#ef4444' :
        riskState === 'WARNING'  ? '#f97316' :
        riskState === 'WATCH'    ? '#eab308' : '#22c55e',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: '0',
        alignItems: 'stretch',
        flexWrap: 'wrap',
        overflow: 'hidden',
      }}
    >
      {readings.map((r, i) => (
        <TelemetryItem key={r.id} item={r} last={i === readings.length - 1} />
      ))}
    </div>
  );
}

function TelemetryItem({ item, last }) {
  const arrowColor = getTrendColor(item.trend);

  return (
    <div style={{
      flex: '1 1 200px',
      padding: '12px 18px',
      borderRight: last ? 'none' : '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    }}>
      {/* Label */}
      <div style={{ fontSize: '11px', color: 'var(--color-muted-bright)', fontWeight: 700, letterSpacing: '0.04em' }}>
        {item.label}
      </div>

      {/* Value + trend arrow */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{
          fontSize: '24px',
          fontWeight: 900,
          color: item.color,
          fontVariantNumeric: 'tabular-nums',
          transition: 'color 0.5s ease',
          lineHeight: 1,
        }}>
          {item.value}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: 500 }}>
          {item.unit}
        </span>
        {item.trendLabel && (
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            color: arrowColor,
            marginLeft: '4px',
          }}>
            {item.trendLabel}
          </span>
        )}
      </div>

      {/* Mini progress bar */}
      <div style={{
        height: '4px',
        background: 'rgba(255,255,255,0.07)',
        borderRadius: '2px',
        overflow: 'hidden',
        marginTop: '4px',
      }}>
        <div style={{
          height: '100%',
          width: `${Math.min(100, (parseFloat(item.value) / item.max) * 100)}%`,
          background: item.color,
          borderRadius: '2px',
          transition: 'width 0.6s ease, background 0.5s ease',
        }} />
      </div>
    </div>
  );
}

function severityColor(val, watchT, warnT, critT) {
  if (val >= critT)  return '#ef4444';
  if (val >= warnT)  return '#f97316';
  if (val >= watchT) return '#eab308';
  return '#22c55e';
}
