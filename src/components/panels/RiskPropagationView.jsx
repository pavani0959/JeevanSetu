/**
 * RiskPropagationView — upstream → downstream flow diagram
 * Shows how Ward 1 cloudburst triggers Ward 3/4 flood risk
 * Highlights wards in propagation order at CRITICAL
 */

const NODES = [
  { id: 'W1', label: 'Ward 1', sub: 'Upper Jeevanpur', icon: '⛰️', role: 'source',  x: 60  },
  { id: 'W3', label: 'Ward 3', sub: 'Riverside Block',  icon: '🌊', role: 'mid',     x: 200 },
  { id: 'W4', label: 'Ward 4', sub: 'Nala Basin',       icon: '⚠️', role: 'danger',  x: 340 },
];

const WARD_RISK_SCORES = {
  NORMAL:   { W1: 8,  W3: 15, W4: 18 },
  WATCH:    { W1: 22, W3: 35, W4: 39 },
  WARNING:  { W1: 38, W3: 58, W4: 64 },
  CRITICAL: { W1: 54, W3: 76, W4: 84 },
};

function nodeColor(role, scenarioKey) {
  if (scenarioKey === 'CRITICAL') {
    if (role === 'danger')  return '#ef4444';
    if (role === 'mid')     return '#f97316';
    if (role === 'source')  return '#eab308';
  }
  if (scenarioKey === 'WARNING') {
    if (role === 'danger') return '#ef4444';
    if (role === 'mid')    return '#f97316';
    return '#eab308';
  }
  if (scenarioKey === 'WATCH')  return '#eab308';
  return '#22c55e';
}

export default function RiskPropagationView({ scenarioKey }) {
  const isCritical = scenarioKey === 'CRITICAL';
  const isWarning  = scenarioKey === 'WARNING' || isCritical;
  const scores     = WARD_RISK_SCORES[scenarioKey];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Annotation */}
      <div style={{ fontSize: '10px', color: 'var(--color-muted)', fontStyle: 'italic', textAlign: 'center' }}>
        "Upstream cloudburst → downstream flood risk"
      </div>

      {/* Flow diagram */}
      <div style={{ position: 'relative', height: '110px', userSelect: 'none' }}>
        <svg viewBox="0 0 420 110" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <marker id="prop-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.25)" />
            </marker>
            <marker id="prop-arrow-active" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#f97316" />
            </marker>
            <filter id="node-glow">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Connection arrows */}
          {/* W1 → W3 */}
          <line x1="118" y1="55" x2="162" y2="55"
            stroke={isWarning ? '#f97316' : 'rgba(255,255,255,0.12)'}
            strokeWidth={isWarning ? 2.5 : 1.5}
            strokeDasharray={isWarning ? '0' : '4 3'}
            markerEnd={isWarning ? 'url(#prop-arrow-active)' : 'url(#prop-arrow)'}
            style={{ transition: 'all 0.5s' }}
          />
          {/* W3 → W4 */}
          <line x1="258" y1="55" x2="302" y2="55"
            stroke={isCritical ? '#ef4444' : isWarning ? '#f97316' : 'rgba(255,255,255,0.12)'}
            strokeWidth={isCritical ? 3 : isWarning ? 2 : 1.5}
            strokeDasharray={isCritical || isWarning ? '0' : '4 3'}
            markerEnd={isCritical ? 'url(#prop-arrow-active)' : isWarning ? 'url(#prop-arrow-active)' : 'url(#prop-arrow)'}
            style={{ transition: 'all 0.5s' }}
          />

          {/* Arrow labels */}
          {isWarning && (
            <text x="140" y="48" textAnchor="middle" fill="#f97316" fontSize="7" fontFamily="Inter">
              rising
            </text>
          )}
          {isCritical && (
            <text x="280" y="48" textAnchor="middle" fill="#ef4444" fontSize="7" fontFamily="Inter">
              ⚡ surge
            </text>
          )}

          {/* Nodes */}
          {NODES.map((node, i) => {
            const color    = nodeColor(node.role, scenarioKey);
            const score    = scores[node.id];
            const animated = isCritical && node.role === 'danger';
            const cx       = node.x + 30;

            return (
              <g key={node.id}>
                {/* Glow ring at CRITICAL */}
                {animated && (
                  <circle cx={cx} cy={55} r={34}
                    fill="none" stroke="#ef444444" strokeWidth="2"
                    style={{ animation: 'wardPulse 1.5s ease-in-out infinite' }}
                  />
                )}
                {/* Node circle */}
                <circle
                  cx={cx} cy={55} r={28}
                  fill={`${color}22`}
                  stroke={color}
                  strokeWidth={animated ? 2.5 : 1.5}
                  style={{
                    transition: 'all 0.5s',
                    filter: animated ? 'url(#node-glow)' : 'none',
                  }}
                />
                {/* Icon */}
                <text x={cx} y={47} textAnchor="middle" fontSize="14">{node.icon}</text>
                {/* Score */}
                <text x={cx} y={62} textAnchor="middle" fontSize="10" fontWeight="800"
                  fill={color} fontFamily="Inter" style={{ transition: 'fill 0.5s' }}>
                  {score}
                </text>
                {/* Ward label */}
                <text x={cx} y={92} textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.75)" fontFamily="Inter" fontWeight="600">
                  {node.label}
                </text>
                <text x={cx} y={103} textAnchor="middle" fontSize="7.5" fill="rgba(255,255,255,0.4)" fontFamily="Inter">
                  {node.sub}
                </text>
              </g>
            );
          })}

          {/* Source label */}
          <text x="90" y="16" textAnchor="middle" fontSize="8" fill="#eab308" fontWeight="700" fontFamily="Inter">
            CLOUDBURST↓
          </text>
        </svg>
      </div>

      {/* Phase labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--color-muted)' }}>
        <span>1. Rainfall source</span>
        <span>2. Stream rises</span>
        <span>3. ⚠️ Flash flood risk</span>
      </div>
    </div>
  );
}
