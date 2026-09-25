import { useEffect, useRef } from 'react';
import { SCENARIOS } from '../../data/scenarios';
import { MICRO_TREND, getTrendArrow, getTrendColor } from '../../data/microTrend';

/**
 * TelemetryBar — live sensor readings strip
 * Shows: Rainfall | Soil Saturation | Stream Level | Risk Score
 * Each value coloured by severity, with trend arrows from microTrend
 */
export default function TelemetryBar({ scenarioKey, liveRainfall, liveSoil, liveStream, riskScore, riskState }) {
  const trend = MICRO_TREND[scenarioKey];

  const readings = [
    {
      id: 'rainfall',
      label: '🌧 Rainfall',
      value: liveRainfall.toFixed(1),
      unit: 'mm/hr',
      max: 150,
      trend: trend.direction.rainfall,
      trendLabel: trend.directionLabel.rainfall,
      color: severityColor(liveRainfall, 15, 64, 115),
    },
    {
      id: 'soil',
      label: '💧 Soil Sat.',
      value: liveSoil.toFixed(0),
      unit: '%',
      max: 100,
      trend: trend.direction.soil,
      trendLabel: trend.directionLabel.soil,
      color: severityColor(liveSoil, 40, 65, 80),
    },
    {
      id: 'stream',
      label: '🌊 Stream',
      value: liveStream.toFixed(1),
      unit: 'm',
      max: 5,
      trend: trend.direction.stream,
      trendLabel: trend.directionLabel.stream,
      color: severityColor(liveStream, 1.0, 2.0, 3.0),
    },
    {
      id: 'risk',
      label: '⚠️ Risk Score',
      value: riskScore,
      unit: '/ 100',
      max: 100,
      trend: trend.direction.rainfall, // use same direction as rainfall
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
        flexWrap: 'nowrap',
        overflow: 'hidden',
      }}
    >
      {readings.map((r, i) => (
        <TelemetryItem key={r.id} item={r} last={i === readings.length - 1} scenarioKey={scenarioKey} />
      ))}
    </div>
  );
}

function TelemetryItem({ item, last, scenarioKey }) {
  const arrowColor = getTrendColor(item.trend);
  const arrow = getTrendArrow(item.trend);

  return (
    <div style={{
      flex: 1,
      padding: '10px 16px',
      borderRight: last ? 'none' : '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    }}>
      {/* Label */}
      <div style={{ fontSize: '10px', color: 'var(--color-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {item.label}
      </div>

      {/* Value + trend arrow */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{
          fontSize: '22px',
          fontWeight: 800,
          color: item.color,
          fontVariantNumeric: 'tabular-nums',
          transition: 'color 0.5s ease',
          lineHeight: 1,
        }}>
          {item.value}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: 400 }}>
          {item.unit}
        </span>
        {item.trendLabel && (
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            color: arrowColor,
            marginLeft: '4px',
            transition: 'color 0.4s',
          }}>
            {item.trendLabel}
          </span>
        )}
      </div>

      {/* Mini progress bar */}
      <div style={{
        height: '3px',
        background: 'rgba(255,255,255,0.07)',
        borderRadius: '2px',
        overflow: 'hidden',
        marginTop: '2px',
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

/** Returns colour based on thresholds (green/yellow/orange/red) */
function severityColor(val, watchT, warnT, critT) {
  if (val >= critT)  return '#ef4444';
  if (val >= warnT)  return '#f97316';
  if (val >= watchT) return '#eab308';
  return '#22c55e';
}
