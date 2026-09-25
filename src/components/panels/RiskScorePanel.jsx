import Badge from '../shared/Badge';
import { RISK_COLORS } from '../../theme';

/**
 * RiskScorePanel — circular arc gauge + explainable breakdown bars
 * Shows: large arc showing score/100, breakdown of 4 factors
 */
export default function RiskScorePanel({ riskResult, scenarioKey }) {
  const { total, breakdown, pct } = riskResult;
  const color = riskResult.state === 'CRITICAL' ? '#ef4444' :
                riskResult.state === 'WARNING'  ? '#f97316' :
                riskResult.state === 'WATCH'    ? '#eab308' : '#22c55e';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* ── Circular gauge ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ArcGauge score={total} color={color} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Badge status={riskResult.state} size="md" />
          <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
            Ward 4 · Nala Basin
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-muted-bright)', lineHeight: 1.5 }}>
            {total < 30  ? 'Low risk. Normal monitoring.' :
             total < 50  ? 'Rising conditions. Stay alert.' :
             total < 75  ? 'Danger threshold exceeded.' :
                           'IMMEDIATE ACTION REQUIRED.'}
          </div>
        </div>
      </div>

      {/* ── Factor breakdown bars ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <BreakdownBar label="☁️ Rainfall Intensity"   score={breakdown.rainfall} max={40} pct={pct.rainfall} color={color} />
        <BreakdownBar label="💧 Soil Saturation"      score={breakdown.soil}     max={25} pct={pct.soil}     color={color} />
        <BreakdownBar label="🌊 Stream Level Rise"    score={breakdown.stream}   max={20} pct={pct.stream}   color={color} />
        <BreakdownBar label="⛰️ Terrain Vulnerability" score={breakdown.terrain}  max={15} pct={pct.terrain}  color={color} />
      </div>
    </div>
  );
}

/* ── Arc Gauge ── */
function ArcGauge({ score, color }) {
  const R = 42;
  const cx = 54, cy = 54;
  const circumference = Math.PI * R; // half-circle arc
  const dashOffset = circumference * (1 - score / 100);
  const angle = (score / 100) * 180 - 90;

  return (
    <div style={{ position: 'relative', width: 108, height: 62, flexShrink: 0 }}>
      <svg width="108" height="62" viewBox="0 0 108 62">
        {/* Track */}
        <path
          d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={10}
          strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease',
            filter: `drop-shadow(0 0 6px ${color}55)`,
          }}
        />
        {/* Indicator dot */}
        <circle
          cx={cx + R * Math.cos((angle * Math.PI) / 180)}
          cy={cy + R * Math.sin((angle * Math.PI) / 180)}
          r={5}
          fill={color}
          style={{ transition: 'all 0.8s ease', filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      {/* Score text */}
      <div style={{
        position: 'absolute',
        bottom: '0px',
        left: 0, right: 0,
        textAlign: 'center',
        lineHeight: 1,
      }}>
        <span style={{
          fontSize: '28px',
          fontWeight: 900,
          color,
          transition: 'color 0.5s',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {score}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-muted)', marginLeft: '2px' }}>/100</span>
      </div>
    </div>
  );
}

/* ── Single breakdown bar ── */
function BreakdownBar({ label, score, max, pct, color }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
        <span style={{ fontSize: '10px', color: 'var(--color-muted-bright)' }}>{label}</span>
        <span style={{ fontSize: '10px', fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>
          {score} / {max}
        </span>
      </div>
      <div style={{
        height: '5px',
        background: 'rgba(255,255,255,0.07)',
        borderRadius: '3px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          borderRadius: '3px',
          transition: 'width 0.8s ease, background 0.5s ease',
          boxShadow: pct > 60 ? `0 0 6px ${color}66` : 'none',
        }} />
      </div>
    </div>
  );
}
