import { ROADS, BRIDGES, SAFE_ROUTE } from '../../data/infrastructure';

/**
 * EvacuationPanel — Unsafe infrastructure + safe route steps + ETA
 * Visible at all times; content changes per scenario
 */
export default function EvacuationPanel({ scenarioKey }) {
  const showRoute   = scenarioKey === 'WARNING' || scenarioKey === 'CRITICAL';
  const showUnsafe  = scenarioKey !== 'NORMAL';

  // Unsafe infra for this scenario
  const unsafeBridges = BRIDGES.filter(b => {
    const s = b.statusByScenario[scenarioKey];
    return s.status === 'CLOSED' || s.status === 'CAUTION';
  });
  const unsafeRoads = ROADS.filter(r => {
    const s = r.statusByScenario[scenarioKey];
    return s.status === 'AVOID' || s.status === 'CAUTION';
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* All-clear message for NORMAL */}
      {scenarioKey === 'NORMAL' && (
        <div style={{
          padding: '10px',
          borderRadius: '8px',
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.2)',
          fontSize: '12px',
          color: '#22c55e',
          fontWeight: 600,
        }}>
          ✅ All roads and bridges clear. No evacuation required.
        </div>
      )}

      {/* Unsafe infrastructure */}
      {showUnsafe && (
        <div>
          <div style={{ fontSize: '10px', color: 'var(--color-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
            ⚠️ Unsafe Infrastructure
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {unsafeBridges.map(b => {
              const s = b.statusByScenario[scenarioKey];
              return (
                <InfraItem
                  key={b.id}
                  icon="🌉"
                  name={b.name}
                  status={s.label}
                  color={s.color}
                  severe={s.status === 'CLOSED'}
                />
              );
            })}
            {unsafeRoads.map(r => {
              const s = r.statusByScenario[scenarioKey];
              return (
                <InfraItem
                  key={r.id}
                  icon="🛣️"
                  name={r.name}
                  status={s.label}
                  color={s.color}
                  severe={s.status === 'AVOID'}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Safe route */}
      {showRoute && (
        <div>
          <div style={{ fontSize: '10px', color: 'var(--color-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
            ✅ Recommended Safe Route
          </div>
          <div style={{
            background: 'rgba(34,197,94,0.07)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '8px',
            padding: '10px',
          }}>
            {/* ETA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#22c55e' }}>
                North Road → Hilltop Shelter
              </span>
              <span style={{
                fontSize: '11px',
                color: 'var(--color-muted-bright)',
                background: 'rgba(255,255,255,0.05)',
                padding: '2px 7px',
                borderRadius: '4px',
              }}>
                ~18 min
              </span>
            </div>

            {/* Step-by-step */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {SAFE_ROUTE.steps.map(step => (
                <div key={step.step} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '9px', fontWeight: 700, color: '#22c55e', flexShrink: 0,
                  }}>
                    {step.step}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-muted-bright)', lineHeight: 1.5 }}>
                    {step.instruction}
                  </span>
                </div>
              ))}
            </div>

            {/* Distance */}
            <div style={{ marginTop: '8px', fontSize: '10px', color: 'var(--color-muted)' }}>
              Distance: {SAFE_ROUTE.distanceKm} km · Estimated time: ~{SAFE_ROUTE.etaMinutes} minutes
            </div>
          </div>
        </div>
      )}

      {/* Watch — advisory only */}
      {scenarioKey === 'WATCH' && (
        <div style={{
          padding: '9px',
          borderRadius: '7px',
          background: 'rgba(234,179,8,0.07)',
          border: '1px solid rgba(234,179,8,0.2)',
          fontSize: '11px',
          color: 'var(--color-muted-bright)',
        }}>
          🟡 Conditions rising. Monitor closely. Be ready to evacuate via North Road if situation worsens.
        </div>
      )}
    </div>
  );
}

function InfraItem({ icon, name, status, color, severe }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '7px 9px',
      borderRadius: '7px',
      background: severe ? 'rgba(239,68,68,0.08)' : 'rgba(249,115,22,0.06)',
      border: `1px solid ${color}44`,
    }}>
      <span style={{ fontSize: '14px' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-dim)' }}>{name}</div>
        <div style={{ fontSize: '10px', color, fontWeight: 700, marginTop: '1px' }}>{status}</div>
      </div>
      {severe && (
        <span style={{
          fontSize: '9px', fontWeight: 800, color: '#ef4444',
          background: 'rgba(239,68,68,0.15)', padding: '2px 6px',
          borderRadius: '4px', border: '1px solid rgba(239,68,68,0.3)',
        }}>
          DO NOT USE
        </span>
      )}
    </div>
  );
}
