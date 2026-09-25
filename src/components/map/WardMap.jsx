import { useState } from 'react';
import { WARDS } from '../../data/wards';
import { RISK_COLORS, RISK_BG_COLORS } from '../../theme';

/* ── SVG layout constants ───────────────────────────────────── */
const W = 600;
const H = 420;

// Ward polygon paths (hand-crafted for Jeevanpur Valley terrain)
const WARD_PATHS = {
  W1: 'M10,50 L115,15 L120,125 L65,175 L10,150 Z',
  W2: 'M120,125 L265,135 L295,215 L200,255 L105,235 L65,175 Z',
  W3: 'M265,135 L430,95 L455,185 L435,285 L355,305 L265,265 L295,215 Z',
  W4: 'M105,235 L200,255 L265,265 L355,305 L365,395 L245,415 L120,385 L80,300 Z',
  W5: 'M115,15 L340,15 L345,95 L265,135 L120,125 Z',
};

// Centroid for labels / markers
const CENTROIDS = {
  W1: { x: 68,  y: 105 },
  W2: { x: 190, y: 192 },
  W3: { x: 365, y: 210 },
  W4: { x: 235, y: 325 },
  W5: { x: 225, y: 70  },
};

// River path (flows Upper Jeevanpur → Riverside → Nala Basin)
const RIVER_PATH = 'M90,80 Q160,145 195,195 Q240,250 315,285 Q345,310 360,385';

// East Bridge position
const BRIDGE = { x: 330, y: 293 };

// Safe route arrow (North Road — Ward 4 → Ward 5)
const SAFE_ROUTE_PATH = 'M240,320 L210,240 L210,160 L230,100 L225,72';

// POI positions
const POI_POSITIONS = {
  POI1: { x: 368, y: 215 }, // School — Ward 3
  POI2: { x: 248, y: 335 }, // Health — Ward 4
  POI3: { x: 195, y: 195 }, // Anganwadi — Ward 2
};

// Risk colours
function wardFill(riskScore, scenarioKey) {
  if (scenarioKey === 'CRITICAL' && riskScore >= 75) return 'rgba(239,68,68,0.55)';
  if (scenarioKey === 'CRITICAL' && riskScore >= 50) return 'rgba(239,68,68,0.35)';
  if (riskScore >= 75) return 'rgba(239,68,68,0.45)';
  if (riskScore >= 50) return 'rgba(249,115,22,0.45)';
  if (riskScore >= 30) return 'rgba(234,179,8,0.35)';
  return 'rgba(34,197,94,0.22)';
}
function wardStroke(riskScore) {
  if (riskScore >= 75) return '#ef4444';
  if (riskScore >= 50) return '#f97316';
  if (riskScore >= 30) return '#eab308';
  return '#22c55e';
}

export default function WardMap({ scenarioKey, onWardClick, selectedWardId }) {
  const [tooltip, setTooltip] = useState(null); // { x, y, content }

  const bridgeClosed = scenarioKey === 'WARNING' || scenarioKey === 'CRITICAL';
  const showSafeRoute = scenarioKey === 'WARNING' || scenarioKey === 'CRITICAL';

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', borderRadius: '8px', display: 'block' }}
        aria-label="Jeevanpur Valley Ward Risk Map"
      >
        {/* ── Defs ── */}
        <defs>
          <filter id="glow-red">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
          </marker>
          <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
          </pattern>
        </defs>

        {/* ── Background ── */}
        <rect width={W} height={H} fill="#0a0f1e" rx="8" />
        {/* Terrain contour lines */}
        {[1, 2, 3].map(i => (
          <ellipse key={i} cx={W/2} cy={H/2} rx={120*i} ry={80*i}
            fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        ))}

        {/* ── Ward polygons ── */}
        {WARDS.map(ward => {
          const score = ward.riskScores[scenarioKey];
          const isSelected = ward.id === selectedWardId;
          const isCritical = score >= 75 && scenarioKey === 'CRITICAL';
          return (
            <g key={ward.id}>
              <path
                d={WARD_PATHS[ward.id]}
                fill={wardFill(score, scenarioKey)}
                stroke={isSelected ? '#ffffff' : wardStroke(score)}
                strokeWidth={isSelected ? 2.5 : 1.5}
                style={{
                  cursor: 'pointer',
                  transition: 'fill 0.6s ease, stroke 0.4s ease',
                  animation: isCritical ? 'wardPulse 1.8s ease-in-out infinite' : 'none',
                  filter: isCritical ? 'url(#glow-red)' : 'none',
                }}
                onClick={() => onWardClick && onWardClick(ward.id)}
                onMouseEnter={e => {
                  const svg = e.currentTarget.ownerSVGElement;
                  const rect = svg.getBoundingClientRect();
                  const vbW = W / rect.width;
                  const vbH = H / rect.height;
                  setTooltip({
                    x: CENTROIDS[ward.id].x,
                    y: CENTROIDS[ward.id].y - 30,
                    content: {
                      type: 'ward', ward,
                      score, scenarioKey,
                    },
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
              {/* Hatching on selected */}
              {isSelected && (
                <path d={WARD_PATHS[ward.id]} fill="url(#hatch)" />
              )}
            </g>
          );
        })}

        {/* ── River / stream ── */}
        <path
          d={RIVER_PATH}
          fill="none"
          stroke="#60a5fa"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={scenarioKey === 'CRITICAL' ? '0' : '6 3'}
          style={{ opacity: 0.75 }}
        />
        {/* River label */}
        <text x="305" y="250" fill="#60a5fa" fontSize="9" opacity="0.7"
          transform="rotate(-30,305,250)" fontFamily="Inter,sans-serif">
          Jeevan Stream
        </text>

        {/* ── East Bridge ── */}
        <g
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setTooltip({ x: BRIDGE.x, y: BRIDGE.y - 22, content: { type: 'bridge', closed: bridgeClosed } })}
          onMouseLeave={() => setTooltip(null)}
        >
          <rect
            x={BRIDGE.x - 14} y={BRIDGE.y - 7}
            width={28} height={14}
            fill={bridgeClosed ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.2)'}
            stroke={bridgeClosed ? '#ef4444' : '#22c55e'}
            strokeWidth={1.5} rx={3}
            style={{ transition: 'all 0.5s ease' }}
            filter={bridgeClosed ? 'url(#glow-red)' : 'none'}
          />
          <text x={BRIDGE.x} y={BRIDGE.y + 4}
            textAnchor="middle" fill={bridgeClosed ? '#ef4444' : '#22c55e'}
            fontSize="7" fontWeight="bold" fontFamily="Inter,sans-serif">
            {bridgeClosed ? '⛔ BRIDGE' : '🌉 BRIDGE'}
          </text>
        </g>

        {/* ── Safe route arrow ── */}
        {showSafeRoute && (
          <g>
            <path
              d={SAFE_ROUTE_PATH}
              fill="none"
              stroke="#22c55e"
              strokeWidth={3}
              strokeDasharray="8 4"
              strokeLinecap="round"
              markerEnd="url(#arrowhead)"
              filter="url(#glow-green)"
              style={{ animation: 'routePulse 2s ease-in-out infinite' }}
            />
            <text x="185" y="188" fill="#22c55e" fontSize="8" fontWeight="bold"
              fontFamily="Inter,sans-serif" opacity="0.9">
              ✅ SAFE ROUTE
            </text>
          </g>
        )}

        {/* ── Ward labels ── */}
        {WARDS.map(ward => {
          const score = ward.riskScores[scenarioKey];
          return (
            <g key={`label-${ward.id}`} style={{ pointerEvents: 'none' }}>
              <text
                x={CENTROIDS[ward.id].x}
                y={CENTROIDS[ward.id].y}
                textAnchor="middle"
                fill="rgba(255,255,255,0.9)"
                fontSize="9"
                fontWeight="700"
                fontFamily="Inter,sans-serif"
              >
                {ward.shortName}
              </text>
              <text
                x={CENTROIDS[ward.id].x}
                y={CENTROIDS[ward.id].y + 12}
                textAnchor="middle"
                fill="rgba(255,255,255,0.55)"
                fontSize="8"
                fontFamily="Inter,sans-serif"
              >
                {score}/100
              </text>
            </g>
          );
        })}

        {/* ── Shelter icon at Ward 5 ── */}
        <g
          onMouseEnter={() => setTooltip({ x: 310, y: 30, content: { type: 'shelter' } })}
          onMouseLeave={() => setTooltip(null)}
          style={{ cursor: 'pointer' }}
        >
          <circle cx={310} cy={52} r={12} fill="rgba(59,130,246,0.25)" stroke="#3b82f6" strokeWidth={1.5} />
          <text x={310} y={57} textAnchor="middle" fontSize="12">🏫</text>
          <text x={310} y={74} textAnchor="middle" fill="#3b82f6" fontSize="7"
            fontWeight="bold" fontFamily="Inter,sans-serif">
            SHELTER
          </text>
        </g>

        {/* ── POI markers ── */}
        {/* School — Ward 3 */}
        <g
          onMouseEnter={() => setTooltip({ x: POI_POSITIONS.POI1.x, y: POI_POSITIONS.POI1.y - 20, content: { type: 'poi', name: 'Jeevanpur Primary School', occupants: 340, priority: 'HIGH', action: showSafeRoute ? 'EVACUATE FIRST' : 'MONITOR' } })}
          onMouseLeave={() => setTooltip(null)}
          style={{ cursor: 'pointer' }}
        >
          <circle
            cx={POI_POSITIONS.POI1.x} cy={POI_POSITIONS.POI1.y} r={9}
            fill={showSafeRoute ? 'rgba(239,68,68,0.3)' : 'rgba(234,179,8,0.2)'}
            stroke={showSafeRoute ? '#ef4444' : '#eab308'}
            strokeWidth={1.5}
            style={{ animation: showSafeRoute ? 'poiPulse 1.4s ease-in-out infinite' : 'none' }}
          />
          <text x={POI_POSITIONS.POI1.x} y={POI_POSITIONS.POI1.y + 4} textAnchor="middle" fontSize="9">🏫</text>
        </g>

        {/* Health Sub-Centre — Ward 4 */}
        <g
          onMouseEnter={() => setTooltip({ x: POI_POSITIONS.POI2.x, y: POI_POSITIONS.POI2.y - 20, content: { type: 'poi', name: 'Nala Basin Health Sub-Centre', occupants: 45, priority: 'HIGH', action: showSafeRoute ? 'EVACUATE FIRST' : 'MONITOR' } })}
          onMouseLeave={() => setTooltip(null)}
          style={{ cursor: 'pointer' }}
        >
          <circle
            cx={POI_POSITIONS.POI2.x} cy={POI_POSITIONS.POI2.y} r={9}
            fill={showSafeRoute ? 'rgba(239,68,68,0.3)' : 'rgba(234,179,8,0.2)'}
            stroke={showSafeRoute ? '#ef4444' : '#eab308'}
            strokeWidth={1.5}
            style={{ animation: showSafeRoute ? 'poiPulse 1.4s ease-in-out infinite' : 'none' }}
          />
          <text x={POI_POSITIONS.POI2.x} y={POI_POSITIONS.POI2.y + 4} textAnchor="middle" fontSize="9">🏥</text>
        </g>

        {/* Anganwadi — Ward 2 */}
        <g
          onMouseEnter={() => setTooltip({ x: POI_POSITIONS.POI3.x, y: POI_POSITIONS.POI3.y - 20, content: { type: 'poi', name: 'Anganwadi Centre', occupants: 28, priority: 'MODERATE', action: 'NOTIFY' } })}
          onMouseLeave={() => setTooltip(null)}
          style={{ cursor: 'pointer' }}
        >
          <circle
            cx={POI_POSITIONS.POI3.x} cy={POI_POSITIONS.POI3.y} r={8}
            fill="rgba(234,179,8,0.2)"
            stroke="#eab308"
            strokeWidth={1}
          />
          <text x={POI_POSITIONS.POI3.x} y={POI_POSITIONS.POI3.y + 4} textAnchor="middle" fontSize="9">🏠</text>
        </g>

        {/* ── SVG Tooltip ── */}
        {tooltip && <MapTooltip data={tooltip} />}
      </svg>

      {/* ── Legend ── */}
      <MapLegend showSafeRoute={showSafeRoute} bridgeClosed={bridgeClosed} />

      {/* ── Keyframe styles ── */}
      <style>{`
        @keyframes wardPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.65; }
        }
        @keyframes routePulse {
          0%, 100% { stroke-opacity: 1; }
          50% { stroke-opacity: 0.5; }
        }
        @keyframes poiPulse {
          0%, 100% { r: 9; opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

/* ── Tooltip component (SVG foreignObject) ── */
function MapTooltip({ data }) {
  const { x, y, content } = data;
  const w = 160, h = content.type === 'ward' ? 72 : 54;
  const cx = Math.min(Math.max(x - w/2, 4), W - w - 4);
  const cy = Math.max(y - h - 6, 4);

  return (
    <foreignObject x={cx} y={cy} width={w} height={h + 10}>
      <div xmlns="http://www.w3.org/1999/xhtml"
        style={{
          background: 'rgba(7,9,26,0.96)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          padding: '7px 10px',
          fontSize: 11,
          color: '#f1f5f9',
          fontFamily: 'Inter,sans-serif',
          lineHeight: 1.5,
          pointerEvents: 'none',
        }}
      >
        {content.type === 'ward' && (
          <>
            <div style={{ fontWeight: 700, marginBottom: 3 }}>{content.ward.name}</div>
            <div style={{ color: '#94a3b8' }}>Pop: {content.ward.population.toLocaleString()} · Elev: {content.ward.elevation}m</div>
            <div style={{ color: '#94a3b8' }}>Risk Score: <span style={{ fontWeight: 700, color: wardStroke(content.score) }}>{content.score}/100</span></div>
            <div style={{ color: '#94a3b8' }}>Vulnerable: {content.ward.vulnerableCount.total} residents</div>
          </>
        )}
        {content.type === 'bridge' && (
          <>
            <div style={{ fontWeight: 700, marginBottom: 3 }}>East Bridge</div>
            <div style={{ color: content.closed ? '#ef4444' : '#22c55e', fontWeight: 600 }}>
              {content.closed ? '⛔ CLOSED — flood risk' : '✅ Open — safe to use'}
            </div>
          </>
        )}
        {content.type === 'shelter' && (
          <>
            <div style={{ fontWeight: 700, marginBottom: 3 }}>🏫 Hilltop Community School</div>
            <div style={{ color: '#94a3b8' }}>Shelter · Capacity: 120</div>
            <div style={{ color: '#3b82f6' }}>Evacuation destination</div>
          </>
        )}
        {content.type === 'poi' && (
          <>
            <div style={{ fontWeight: 700, marginBottom: 3 }}>{content.name}</div>
            <div style={{ color: '#94a3b8' }}>Occupants: ~{content.occupants}</div>
            <div style={{ color: content.priority === 'HIGH' ? '#ef4444' : '#eab308', fontWeight: 600 }}>
              {content.action}
            </div>
          </>
        )}
      </div>
    </foreignObject>
  );
}

/* ── Map Legend ── */
function MapLegend({ showSafeRoute, bridgeClosed }) {
  const items = [
    { color: '#22c55e', label: 'Normal' },
    { color: '#eab308', label: 'Watch' },
    { color: '#f97316', label: 'Warning' },
    { color: '#ef4444', label: 'Critical' },
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
      {items.map(i => (
        <div key={i.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8' }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: i.color, opacity: 0.8 }} />
          {i.label}
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#60a5fa' }}>
        <div style={{ width: 14, height: 3, background: '#60a5fa', borderRadius: 2 }} />
        Stream
      </div>
      {showSafeRoute && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#22c55e', fontWeight: 600 }}>
          <div style={{ width: 14, height: 3, background: '#22c55e', borderRadius: 2 }} />
          Safe Route
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: bridgeClosed ? '#ef4444' : '#22c55e' }}>
        🌉 Bridge: {bridgeClosed ? 'CLOSED' : 'Open'}
      </div>
      <div style={{ fontSize: 11, color: '#94a3b8' }}>🏫 School · 🏥 Health · 🏠 Anganwadi</div>
    </div>
  );
}
