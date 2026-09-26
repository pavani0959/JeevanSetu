const CONTACTS = [
  { role: 'District Emergency Operations Center (DEOC)', phone: '1077 / +91 1800-180-2211', status: '24x7 Active', type: 'COMMAND' },
  { role: 'NDRF Heavy Response Unit (Battalion 8)', phone: '+91 94120-11223', status: 'Deployed - Base 4', type: 'RESCUE' },
  { role: 'SDRF Mountain Rescue Team', phone: '+91 98370-55441', status: 'Patrolling Ward 2', type: 'RESCUE' },
  { role: 'Hilltop Shelter Coordinator (School)', phone: '+91 94111-88204', status: 'Ready (Cap: 120)', type: 'SHELTER' },
  { role: 'Rapid Medical Emergency Dispatch', phone: '108 / +91 135-2712200', status: '3 Ambulances Stationed', type: 'MEDICAL' },
];

export default function ControlCenterDirectory() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
          Emergency Dispatch & Helplines Directory
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
          Direct Operational Hotline Links
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
        {CONTACTS.map((c, i) => (
          <div
            key={i}
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-dim)' }}>
                {c.role}
              </span>
              <span style={{
                fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                background: c.type === 'COMMAND' ? 'rgba(59,130,246,0.15)' : c.type === 'RESCUE' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
                color: c.type === 'COMMAND' ? '#60a5fa' : c.type === 'RESCUE' ? '#ef4444' : '#22c55e',
              }}>
                {c.type}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#3b82f6', fontVariantNumeric: 'tabular-nums' }}>
                {c.phone}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--color-muted)' }}>
                {c.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
