import Badge from '../shared/Badge';
import { WARDS } from '../../data/wards';

/**
 * WardInfoPanel — shows details for the selected ward
 * Click any ward on map → this panel updates
 */
export default function WardInfoPanel({ selectedWardId, scenarioKey, onWardChange }) {
  const ward = WARDS.find(w => w.id === selectedWardId) || WARDS[3]; // default W4
  const score = ward.riskScores[scenarioKey];
  const riskState =
    score >= 75 ? 'CRITICAL' :
    score >= 50 ? 'WARNING'  :
    score >= 30 ? 'WATCH'    : 'NORMAL';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Ward selector tabs */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {WARDS.map(w => (
          <button
            key={w.id}
            onClick={() => onWardChange && onWardChange(w.id)}
            style={{
              padding: '3px 8px',
              borderRadius: '5px',
              border: `1px solid ${selectedWardId === w.id ? 'rgba(255,255,255,0.3)' : 'var(--color-border)'}`,
              background: selectedWardId === w.id ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: selectedWardId === w.id ? '#f1f5f9' : 'var(--color-muted)',
              fontSize: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s',
            }}
          >
            {w.id}
          </button>
        ))}
      </div>

      {/* Ward header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', marginBottom: '2px' }}>
            {ward.name}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
            {ward.description}
          </div>
        </div>
        <Badge status={riskState} size="sm" />
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <StatPill label="Elevation" value={`${ward.elevation}m`} icon="⛰️" />
        <StatPill label="Population" value={ward.population.toLocaleString()} icon="👥" />
        <StatPill label="Risk Score" value={`${score}/100`} icon="⚠️" highlight />
        <StatPill label="Terrain Risk" value={`${Math.round(ward.terrainVulnerability * 100)}%`} icon="🏔️" />
      </div>

      {/* Vulnerable residents */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '8px',
        padding: '10px',
      }}>
        <div style={{ fontSize: '10px', color: 'var(--color-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Vulnerable Residents
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          <VulnRow icon="🧓" label="Elderly" count={ward.vulnerableCount.elderly} />
          <VulnRow icon="👶" label="Children" count={ward.vulnerableCount.children} />
          <VulnRow icon="🤱" label="Pregnant" count={ward.vulnerableCount.pregnant} />
          <VulnRow icon="♿" label="Mobility" count={ward.vulnerableCount.mobility} />
        </div>
        <div style={{
          marginTop: '8px',
          paddingTop: '7px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '11px', color: 'var(--color-muted-bright)', fontWeight: 600 }}>
            Total priority evacuees
          </span>
          <span style={{
            fontSize: '15px',
            fontWeight: 800,
            color: riskState === 'CRITICAL' ? '#ef4444' : riskState === 'WARNING' ? '#f97316' : '#f1f5f9',
          }}>
            {ward.vulnerableCount.total}
          </span>
        </div>
      </div>

      {/* Safe zone / evacuation destination flag */}
      {ward.isSafeZone && (
        <div style={{
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: '7px',
          padding: '7px 10px',
          fontSize: '11px',
          color: '#22c55e',
          fontWeight: 600,
        }}>
          ✅ Safe Zone — Evacuation Destination
        </div>
      )}
      {ward.isPrimaryRisk && (
        <div style={{
          background: riskState === 'CRITICAL' ? 'rgba(239,68,68,0.1)' : 'rgba(249,115,22,0.08)',
          border: `1px solid ${riskState === 'CRITICAL' ? 'rgba(239,68,68,0.25)' : 'rgba(249,115,22,0.2)'}`,
          borderRadius: '7px',
          padding: '7px 10px',
          fontSize: '11px',
          color: riskState === 'CRITICAL' ? '#ef4444' : '#f97316',
          fontWeight: 600,
        }}>
          ⚠️ Primary Risk Ward — Priority Evacuation Target
        </div>
      )}
    </div>
  );
}

function StatPill({ label, value, icon, highlight }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '6px',
      padding: '6px 8px',
      border: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{ fontSize: '9px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {icon} {label}
      </div>
      <div style={{
        fontSize: '13px',
        fontWeight: 700,
        color: highlight ? 'var(--color-warning)' : '#f1f5f9',
        marginTop: '2px',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>
    </div>
  );
}

function VulnRow({ icon, label, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
      <span style={{ color: 'var(--color-muted)' }}>{icon} {label}</span>
      <span style={{ fontWeight: 700, color: 'var(--color-text-dim)', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
    </div>
  );
}
