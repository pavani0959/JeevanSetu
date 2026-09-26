const SOP_LEVELS = [
  {
    level: 'LEVEL 1 — WATCH',
    color: '#eab308',
    bg: 'rgba(234,179,8,0.08)',
    border: 'rgba(234,179,8,0.2)',
    title: 'Pre-Emergency Readiness Protocol',
    steps: [
      'Activate early warning radio beacons and telemetry monitoring.',
      'Notify Ward Officers & Anganwadi supervisors of potential rain surge.',
      'Check emergency power backups and satellite communication links.',
    ],
  },
  {
    level: 'LEVEL 2 — WARNING',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.2)',
    title: 'Pre-Evacuation & Containment Protocol',
    steps: [
      'Close high-risk transit routes (e.g., East Bridge across Jeevan Stream).',
      'Deploy NDRF & SDRF teams to high-elevation standby points.',
      'Issue SMS alerts & broadcast sirens for vulnerable residents in Ward 4.',
    ],
  },
  {
    level: 'LEVEL 3 — CRITICAL',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.2)',
    title: 'Mandatory Evacuation & Search/Rescue',
    steps: [
      'Execute immediate guided evacuation along North Road to Hilltop School.',
      'Deploy amphibious rescue craft & medical rapid intervention teams.',
      'Coordinate zero-delay triage at emergency shelters for vulnerable individuals.',
    ],
  },
];

export default function EmergencySOPGuide({ scenarioKey }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
          Standard Operating Procedures (SOP) & Protocol Guide
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
          Operational Command Directives
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {SOP_LEVELS.map(sop => {
          const isActive =
            (scenarioKey === 'WATCH' && sop.level.includes('WATCH')) ||
            (scenarioKey === 'WARNING' && sop.level.includes('WARNING')) ||
            (scenarioKey === 'CRITICAL' && sop.level.includes('CRITICAL')) ||
            (scenarioKey === 'NORMAL' && sop.level.includes('WATCH'));

          return (
            <div
              key={sop.level}
              style={{
                padding: '14px',
                borderRadius: '10px',
                background: sop.bg,
                border: `1.5px solid ${isActive ? sop.color : sop.border}`,
                boxShadow: isActive ? `0 0 16px ${sop.color}25` : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: sop.color, letterSpacing: '0.08em' }}>
                  {sop.level}
                </span>
                {isActive && (
                  <span style={{
                    fontSize: '9px', padding: '2px 6px', borderRadius: '4px',
                    background: sop.color, color: '#000', fontWeight: 900,
                  }}>
                    ACTIVE PHASE
                  </span>
                )}
              </div>

              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '10px' }}>
                {sop.title}
              </div>

              <ul style={{ paddingLeft: '16px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {sop.steps.map((step, i) => (
                  <li key={i} style={{ fontSize: '11px', color: 'var(--color-muted-bright)', lineHeight: 1.5 }}>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
