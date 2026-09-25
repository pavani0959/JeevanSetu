import { WARDS } from '../../data/wards';
import { VULNERABLE_POIS, getPOIActions } from '../../data/vulnerablePOI';

/**
 * PriorityPanel — vulnerable resident counts + special location priority section
 * Numbers from Ward 4 (primary risk ward); border colour changes with scenario
 */
export default function PriorityPanel({ scenarioKey }) {
  const ward = WARDS.find(w => w.id === 'W4'); // Nala Basin — primary risk ward
  const { evacuate, notify } = getPOIActions(scenarioKey);
  const isUrgent   = scenarioKey === 'WARNING' || scenarioKey === 'CRITICAL';
  const isCritical = scenarioKey === 'CRITICAL';

  const borderColor =
    isCritical ? 'rgba(239,68,68,0.35)' :
    isUrgent   ? 'rgba(249,115,22,0.25)' :
    scenarioKey === 'WATCH' ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.06)';

  const bgColor =
    isCritical ? 'rgba(239,68,68,0.05)' :
    isUrgent   ? 'rgba(249,115,22,0.04)' : 'transparent';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Resident counts */}
      <div style={{
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        padding: '10px',
        background: bgColor,
        transition: 'border-color 0.5s, background 0.5s',
      }}>
        <div style={{ fontSize: '10px', color: 'var(--color-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Priority Evacuees — Ward 4
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <CountRow icon="🧓" label="Elderly residents"          count={ward.vulnerableCount.elderly}  />
          <CountRow icon="👶" label="Children under 10"          count={ward.vulnerableCount.children} />
          <CountRow icon="🤱" label="Pregnant women"             count={ward.vulnerableCount.pregnant} />
          <CountRow icon="♿" label="Mobility-assisted residents" count={ward.vulnerableCount.mobility} />
        </div>

        <div style={{
          marginTop: '8px',
          paddingTop: '7px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '11px', color: 'var(--color-muted-bright)', fontWeight: 600 }}>
            Total priority evacuees
          </span>
          <span style={{
            fontSize: '20px',
            fontWeight: 900,
            color: isCritical ? '#ef4444' : isUrgent ? '#f97316' : '#f1f5f9',
            fontVariantNumeric: 'tabular-nums',
            transition: 'color 0.4s',
          }}>
            {ward.vulnerableCount.total}
          </span>
        </div>

        {isUrgent && (
          <div style={{ marginTop: '8px', fontSize: '10px', color: 'var(--color-muted-bright)', lineHeight: 1.6 }}>
            📢 Coordinate with village volunteer for assisted evacuation
          </div>
        )}
      </div>

      {/* Special Location Priority section */}
      <div>
        <div style={{ fontSize: '10px', color: 'var(--color-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
          Special Location Priority
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {VULNERABLE_POIS.map(poi => {
            const needsEvac   = evacuate.some(p => p.id === poi.id);
            const needsNotify = notify.some(p => p.id === poi.id);
            const action      = needsEvac ? 'EVACUATE FIRST' : needsNotify ? 'NOTIFY' : 'MONITOR';
            const actionColor = needsEvac ? '#ef4444' : needsNotify ? '#eab308' : '#22c55e';
            const urgent      = needsEvac;

            return (
              <div
                key={poi.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 9px',
                  borderRadius: '7px',
                  background: urgent ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${urgent ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.05)'}`,
                  transition: 'all 0.4s ease',
                  animation: urgent && isCritical ? 'glow-pulse 2s ease-in-out infinite' : 'none',
                }}
              >
                <span style={{ fontSize: '16px', flexShrink: 0 }}>
                  {poi.type === 'school' ? '🏫' : poi.type === 'health' ? '🏥' : '🏠'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {poi.shortName}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--color-muted)' }}>
                    {poi.ward} · ~{poi.estimatedOccupants} occupants
                  </div>
                </div>
                <span style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  color: actionColor,
                  background: `${actionColor}18`,
                  padding: '2px 7px',
                  borderRadius: '4px',
                  border: `1px solid ${actionColor}33`,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}>
                  {action}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CountRow({ icon, label, count }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '3px 0',
      fontSize: '11px',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <span style={{ color: 'var(--color-muted)' }}>{icon} {label}</span>
      <span style={{ fontWeight: 700, color: 'var(--color-text-dim)', fontVariantNumeric: 'tabular-nums', minWidth: '24px', textAlign: 'right' }}>
        {count}
      </span>
    </div>
  );
}
