import { SHELTERS } from '../../data/infrastructure';

/**
 * ShelterCard — shows Hilltop Community School shelter status
 * Status badge + animated capacity bar changes by scenario
 */
export default function ShelterCard({ scenarioKey }) {
  const shelter = SHELTERS[0];
  const status  = shelter.statusByScenario[scenarioKey];
  const fillPct = Math.round((status.occupancy / shelter.totalCapacity) * 100);

  const statusBgColor =
    status.status === 'OPEN'      ? 'rgba(34,197,94,0.1)'   :
    status.status === 'PREPARING' ? 'rgba(249,115,22,0.1)'  :
                                    'rgba(100,116,139,0.08)';
  const statusBorderColor =
    status.status === 'OPEN'      ? 'rgba(34,197,94,0.25)'  :
    status.status === 'PREPARING' ? 'rgba(249,115,22,0.25)' :
                                    'rgba(100,116,139,0.15)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', marginBottom: '2px' }}>
            🏫 {shelter.name}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-muted)' }}>
            {shelter.address}
          </div>
        </div>
        <StatusBadge status={status.status} label={status.label} color={status.color} />
      </div>

      {/* Status message */}
      <div style={{
        padding: '8px 10px',
        borderRadius: '7px',
        background: statusBgColor,
        border: `1px solid ${statusBorderColor}`,
        fontSize: '11px',
        color: 'var(--color-muted-bright)',
      }}>
        {status.description}
      </div>

      {/* Capacity bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Capacity
          </span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-dim)', fontVariantNumeric: 'tabular-nums' }}>
            <span style={{ color: status.color }}>{status.availableSpaces}</span>
            <span style={{ color: 'var(--color-muted)' }}> / {shelter.totalCapacity} spaces available</span>
          </span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.07)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${fillPct}%`,
            background: `linear-gradient(90deg, ${status.color}99, ${status.color})`,
            borderRadius: '4px',
            transition: 'width 0.9s ease, background 0.5s ease',
            boxShadow: status.status === 'OPEN' ? `0 0 8px ${status.color}55` : 'none',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
          <span style={{ fontSize: '9px', color: 'var(--color-muted)' }}>
            {status.occupancy > 0 ? `${status.occupancy} currently sheltered` : 'No one sheltered yet'}
          </span>
          <span style={{ fontSize: '9px', color: 'var(--color-muted)' }}>
            {fillPct}% occupied
          </span>
        </div>
      </div>

      {/* Info row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
        <InfoPill label="Distance (W4)" value={shelter.distanceFromW4} icon="📍" />
        <InfoPill label="ETA from W4"   value={`~${shelter.etaMinutes} min`} icon="⏱️" />
        <InfoPill label="Elevation"     value={`${shelter.elevation}m`}    icon="⛰️" />
        <InfoPill label="Total Capacity" value={`${shelter.totalCapacity}`} icon="🏠" />
      </div>

      {/* Contact */}
      <div style={{ fontSize: '10px', color: 'var(--color-muted)', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        📞 {shelter.contactMock}
      </div>
    </div>
  );
}

function StatusBadge({ status, label, color }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 9px', borderRadius: '9999px',
      background: `${color}18`, border: `1px solid ${color}44`,
      fontSize: '10px', fontWeight: 700, color, whiteSpace: 'nowrap',
      fontFamily: 'Inter, sans-serif',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0,
        animation: status === 'OPEN' ? 'glow-pulse 1.5s ease-in-out infinite' : 'none',
        boxShadow: status === 'OPEN' ? `0 0 5px ${color}` : 'none',
      }} />
      {label}
    </span>
  );
}

function InfoPill({ label, value, icon }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '6px',
      padding: '5px 8px',
      border: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{ fontSize: '9px', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9', marginTop: '2px' }}>
        {value}
      </div>
    </div>
  );
}
