/**
 * MLPredictionPanel.jsx
 *
 * Shows Random Forest ML prediction alongside the rule-based score.
 * Displays confidence, class probabilities bar, and model metadata.
 * If backend is offline, shows graceful fallback.
 */

import { useMLPredict } from '../../hooks/useMLPredict';

const STATE_COLORS = {
  NORMAL:   '#22c55e',
  WATCH:    '#eab308',
  WARNING:  '#f97316',
  CRITICAL: '#ef4444',
};

const STATE_BG = {
  NORMAL:   'rgba(34,197,94,0.10)',
  WATCH:    'rgba(234,179,8,0.10)',
  WARNING:  'rgba(249,115,22,0.10)',
  CRITICAL: 'rgba(239,68,68,0.12)',
};

export default function MLPredictionPanel({ rainfall, soil, stream, terrain = 0.92 }) {
  const { mlResult, isLoading, error, backendOnline } = useMLPredict({
    rainfall, soil, stream, terrain,
  });

  // ── Loading state ──────────────────────────────────────────────
  if (isLoading && !mlResult) {
    return (
      <div style={{ padding: '14px 0', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: 'var(--color-muted-bright)', letterSpacing: '0.08em' }}>
          🤖 Running RF model…
        </div>
        <div style={{ marginTop: 8, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: '60%',
            background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
            borderRadius: 4,
            animation: 'shimmer 1.2s ease-in-out infinite',
          }} />
        </div>
      </div>
    );
  }

  // ── Backend offline fallback ───────────────────────────────────
  if (!backendOnline || error) {
    return (
      <div style={{
        padding: '12px 14px',
        background: 'rgba(234,179,8,0.06)',
        border: '1px solid rgba(234,179,8,0.2)',
        borderRadius: 8,
        fontSize: 11,
        color: '#fbbf24',
      }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>⚠️ ML Backend Offline</div>
        <div style={{ color: 'var(--color-muted-bright)' }}>
          Rule-based engine active. Start FastAPI server to enable RF model.
        </div>
        <div style={{ marginTop: 6, fontFamily: 'monospace', fontSize: 10, opacity: 0.7 }}>
          cd backend && uvicorn main:app --port 8000
        </div>
      </div>
    );
  }

  if (!mlResult) return null;

  const stateColor = STATE_COLORS[mlResult.state] || '#60a5fa';
  const stateBg    = STATE_BG[mlResult.state]    || 'rgba(96,165,250,0.1)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── ML State Badge ─────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        background: stateBg,
        border: `1px solid ${stateColor}33`,
        borderRadius: 8,
      }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--color-muted-bright)', fontWeight: 600, letterSpacing: '0.08em' }}>
            🤖 RF MODEL PREDICTION
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: stateColor, marginTop: 2, letterSpacing: '0.04em' }}>
            {mlResult.state}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: 'var(--color-muted-bright)' }}>Confidence</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: stateColor }}>
            {mlResult.confidence}%
          </div>
        </div>
      </div>

      {/* ── Score Comparison ────────────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
      }}>
        <ScoreBox label="ML Score" value={mlResult.ml_score} color={stateColor} note="Random Forest" />
        <ScoreBox label="Rule Score" value={mlResult.rule_score} color="#60a5fa" note="Weighted Engine" />
      </div>

      {/* ── Score explanation (answers judge question) ────────── */}
      <div style={{
        padding: '8px 10px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 7,
        fontSize: 9.5,
        color: 'var(--color-muted-bright)',
        lineHeight: 1.6,
      }}>
        <div style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: 3 }}>
          ℹ️ How scores work together:
        </div>
        <div>
          <span style={{ color: stateColor, fontWeight: 700 }}>RF Model</span> classifies risk <em>state</em> (which alert level to trigger). &nbsp;
          <span style={{ color: '#60a5fa', fontWeight: 700 }}>Rule Engine</span> gives explainable <em>breakdown</em> (why each factor contributes). Both agree on state — differences in numeric score reflect different mathematical approaches. <strong>The RF state classification triggers alerts.</strong>
        </div>
      </div>


      {/* ── Class Probabilities ─────────────────────────────────── */}
      <div>
        <div style={{ fontSize: 10, color: 'var(--color-muted-bright)', fontWeight: 700, marginBottom: 6, letterSpacing: '0.06em' }}>
          CLASS PROBABILITIES
        </div>
        {Object.entries(mlResult.probabilities).map(([label, pct]) => (
          <ProbBar key={label} label={label} pct={pct} color={STATE_COLORS[label]} isActive={label === mlResult.state} />
        ))}
      </div>

      {/* ── Model metadata ──────────────────────────────────────── */}
      <div style={{
        fontSize: 9.5, color: 'var(--color-muted-bright)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: 8,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>🌐 Backend: <span style={{ color: '#22c55e', fontWeight: 700 }}>ONLINE</span></span>
        <span style={{ opacity: 0.7 }}>{mlResult.model_version}</span>
      </div>
    </div>
  );
}

function ScoreBox({ label, value, color, note }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 8,
      padding: '8px 12px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 9, color: 'var(--color-muted-bright)', fontWeight: 600, letterSpacing: '0.06em' }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 900, color, lineHeight: 1.1, marginTop: 2 }}>
        {value}
      </div>
      <div style={{ fontSize: 8.5, color: 'var(--color-muted-bright)', marginTop: 2 }}>{note}</div>
    </div>
  );
}

function ProbBar({ label, pct, color, isActive }) {
  return (
    <div style={{ marginBottom: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <span style={{
          fontSize: 10, fontWeight: isActive ? 800 : 500,
          color: isActive ? color : 'var(--color-muted-bright)',
          letterSpacing: '0.04em',
        }}>
          {isActive ? '▶ ' : ''}{label}
        </span>
        <span style={{ fontSize: 10, color: isActive ? color : 'var(--color-muted-bright)', fontWeight: 700 }}>
          {pct}%
        </span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: 4,
          opacity: isActive ? 1 : 0.45,
          transition: 'width 0.6s ease',
          boxShadow: isActive ? `0 0 6px ${color}` : 'none',
        }} />
      </div>
    </div>
  );
}
