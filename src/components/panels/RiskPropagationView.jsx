const CASCADE_NODES = [
  { id: 'W1', name: 'Ward 1', role: 'Cloudburst Source', elev: '1,650m', delay: 'T+0 Min', desc: 'Rainfall runoff originates at high ridge', iconColor: '#eab308' },
  { id: 'W2', name: 'Ward 2', role: 'West Slope Tributary', elev: '1,320m', delay: 'T+8 Min', desc: 'Soil saturation reached 78%', iconColor: '#f97316' },
  { id: 'W3', name: 'Ward 3', role: 'East River Junction', elev: '980m', delay: 'T+18 Min', desc: 'Stream overflow & bridge closure risk', iconColor: '#f97316' },
  { id: 'W4', name: 'Ward 4', role: 'Nala Basin Vulnerability', elev: '820m', delay: 'T+25 Min', desc: 'High-density ravine inundation zone', iconColor: '#ef4444' },
  { id: 'W5', name: 'Ward 5', role: 'Valley Safe Shelter Hub', elev: '790m', delay: 'T+35 Min', desc: 'Hilltop School evacuation destination', iconColor: '#22c55e' },
];

const WARD_CASCADE_SCORES = {
  NORMAL:   { W1: 12, W2: 15, W3: 18, W4: 20, W5: 10 },
  WATCH:    { W1: 32, W2: 38, W3: 42, W4: 48, W5: 15 },
  WARNING:  { W1: 58, W2: 64, W3: 72, W4: 78, W5: 25 },
  CRITICAL: { W1: 82, W2: 88, W3: 94, W4: 98, W5: 35 },
};

export default function RiskPropagationView({ scenarioKey }) {
  const scores = WARD_CASCADE_SCORES[scenarioKey] || WARD_CASCADE_SCORES.NORMAL;
  const isCritical = scenarioKey === 'CRITICAL';
  const isWarning  = scenarioKey === 'WARNING' || isCritical;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* Title subtitle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: 'var(--color-muted-bright)', fontWeight: 700 }}>
          Upstream Runoff to Downstream Surge Cascade
        </span>
        <span style={{
          fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
          background: isCritical ? 'rgba(239,68,68,0.2)' : isWarning ? 'rgba(249,115,22,0.2)' : 'rgba(34,197,94,0.15)',
          color: isCritical ? '#ef4444' : isWarning ? '#f97316' : '#22c55e',
          fontWeight: 800,
        }}>
          {isCritical ? 'CRITICAL SURGE' : isWarning ? 'WARNING SURGE' : 'STABLE FLOW'}
        </span>
      </div>

      {/* Expanded Vertical / Horizontal Flow Sequence */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {CASCADE_NODES.map((node, i) => {
          const score = scores[node.id];
          const nodeColor = score >= 75 ? '#ef4444' : score >= 50 ? '#f97316' : score >= 30 ? '#eab308' : '#22c55e';
          const nodeBg = score >= 75 ? 'rgba(239,68,68,0.1)' : score >= 50 ? 'rgba(249,115,22,0.1)' : score >= 30 ? 'rgba(234,179,8,0.1)' : 'rgba(34,197,94,0.08)';

          return (
            <div key={node.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: nodeBg,
                  border: `1px solid ${nodeColor}33`,
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%', background: nodeColor,
                    color: '#0a0f1e', fontWeight: 900, fontSize: '11px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 8px ${nodeColor}66`,
                  }}>
                    {node.id}
                  </span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text)' }}>
                      {node.name} <span style={{ fontSize: '10px', color: 'var(--color-muted)', fontWeight: 400 }}>({node.elev})</span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--color-muted-bright)' }}>
                      {node.role} — {node.desc}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: nodeColor, fontVariantNumeric: 'tabular-nums' }}>
                    {score}/100
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--color-muted)', fontWeight: 600 }}>
                    {node.delay}
                  </div>
                </div>
              </div>

              {/* Flow connector line between nodes */}
              {i < CASCADE_NODES.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '22px', gap: '8px' }}>
                  <div style={{
                    width: '2px', height: '14px',
                    background: isWarning ? `linear-gradient(180deg, ${nodeColor}, #60a5fa)` : 'rgba(255,255,255,0.1)',
                  }} />
                  <span style={{ fontSize: '9px', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                    {isCritical ? 'High Volume Surface Water Flow' : 'Normal Natural Drainage'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
