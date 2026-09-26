import { WARDS } from '../../data/wards';

const WARD_EXTRA_DATA = {
  W1: { slope: '12°', landuse: 'Commercial / Base Market', evacRoute: 'South Highway (Open)', rescueTeams: 'Team Alpha (24 NDRF)' },
  W2: { slope: '24°', landuse: 'Residential Hillside', evacRoute: 'West Bypass (Open)', rescueTeams: 'Team Beta (18 SDRF)' },
  W3: { slope: '18°', landuse: 'Institutional / Ridge', evacRoute: 'Ridge Connector (Caution)', rescueTeams: 'Team Gamma (12 Local Rescuers)' },
  W4: { slope: '34°', landuse: 'Ravine Settlement / Basin', evacRoute: 'North Road (Primary Safe Route)', rescueTeams: 'Team Delta (30 NDRF Heavy Unit)' },
  W5: { slope: '8°', landuse: 'Shelter Hub / Valley Plain', evacRoute: 'Shelter Access Corridor', rescueTeams: 'Central Logistics Hub' },
};

export default function WardRiskMatrixTable({ scenarioKey, onSelectWard, selectedWardId }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
          Ward Vulnerability & Disaster Readiness Matrix
        </span>
        <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
          Click row to select ward on map
        </span>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--color-muted-bright)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Ward Name</th>
              <th style={{ padding: '10px 12px', fontWeight 600 }}>Elevation & Slope</th>
              <th style={{ padding: '10px 12px', fontWeight 600 }}>Population & At-Risk</th>
              <th style={{ padding: '10px 12px', fontWeight 600 }}>Risk Score</th>
              <th style={{ padding: '10px 12px', fontWeight 600 }}>Evacuation Corridor</th>
              <th style={{ padding: '10px 12px', fontWeight 600 }}>Assigned Response Unit</th>
            </tr>
          </thead>
          <tbody>
            {WARDS.map((w, idx) => {
              const score = w.riskScores[scenarioKey];
              const extra = WARD_EXTRA_DATA[w.id] || {};
              const isSelected = w.id === selectedWardId;

              const statusColor = score >= 75 ? '#ef4444' : score >= 50 ? '#f97316' : score >= 30 ? '#eab308' : '#22c55e';
              const statusBg = score >= 75 ? 'rgba(239,68,68,0.12)' : score >= 50 ? 'rgba(249,115,22,0.12)' : score >= 30 ? 'rgba(234,179,8,0.12)' : 'rgba(34,197,94,0.12)';

              return (
                <tr
                  key={w.id}
                  onClick={() => onSelectWard && onSelectWard(w.id)}
                  style={{
                    borderBottom: idx === WARDS.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)',
                    background: isSelected ? 'rgba(59,130,246,0.12)' : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  <td style={{ padding: '10px 12px', color: 'var(--color-text)' }}>
                    <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isSelected && <span style={{ color: '#60a5fa', fontSize: '10px' }}>●</span>}
                      {w.name}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--color-muted)' }}>{extra.landuse}</div>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--color-muted-bright)' }}>
                    <div>{w.elevation}m ASL</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-muted)' }}>Slope: {extra.slope}</div>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--color-muted-bright)' }}>
                    <div>{w.population.toLocaleString()} residents</div>
                    <div style={{ fontSize: '10px', color: '#f97316' }}>{w.vulnerableCount.total} vulnerable</div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: statusBg,
                      color: statusColor,
                      fontWeight: 800,
                      border: `1px solid ${statusColor}33`,
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {score} / 100
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--color-muted-bright)' }}>
                    {extra.evacRoute}
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--color-muted)' }}>
                    {extra.rescueTeams}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
