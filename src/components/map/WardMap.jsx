import { useState } from 'react';
import { WARDS } from '../../data/wards';

/* ── SVG layout constants ───────────────────────────────────── */
const W = 600;
const H = 420;

const WARD_PATHS = {
  W1: 'M10,50 L115,15 L120,125 L65,175 L10,150 Z',
  W2: 'M120,125 L265,135 L295,215 L200,255 L105,235 L65,175 Z',
  W3: 'M265,135 L430,95 L455,185 L435,285 L355,305 L265,265 L295,215 Z',
  W4: 'M105,235 L200,255 L265,265 L355,305 L365,395 L245,415 L120,385 L80,300 Z',
  W5: 'M115,15 L340,15 L345,95 L265,135 L120,125 Z',
};

const CENTROIDS = {
  W1: { x: 68,  y: 105 },
  W2: { x: 190, y: 192 },
  W3: { x: 365, y: 210 },
  W4: { x: 235, y: 325 },
  W5: { x: 225, y: 70  },
};

const RIVER_PATH = 'M90,80 Q160,145 195,195 Q240,250 315,285 Q345,310 360,385';
const BRIDGE = { x: 330, y: 293 };
const SAFE_ROUTE_PATH = 'M240,320 L210,240 L210,160 L230,100 L225,72';

const POI_POSITIONS = {
  POI1: { x: 368, y: 215 },
  POI2: { x: 248, y: 335 },
  POI3: { x: 195, y: 195 },
};

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
  const [hoverWard, setHoverWard] = useState(null);

  const bridgeClosed = scenarioKey === 'WARNING' || scenarioKey === 'CRITICAL';
  const showSafeRoute = scenarioKey === 'WARNING' || scenarioKey === 'CRITICAL';

  const activeWardObj = WARDS.find(w => w.id === selectedWardId) || WARDS[3];
  const activeWardScore = activeWardObj.riskScores[scenarioKey];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {/* ── Stable Ward Selector Buttons Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11px', color: 'var(--color-muted-bright)', fontWeight: 700 }}>
          Select Ward to Inspect:
        </span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {WARDS.map(w => {
            const isSel = w.id === selectedWardId;
            const score = w.riskScores[scenarioKey];
            const color = wardStroke(score);

            return (
              <button
                key={w.id}
                onClick={() => onWardClick && onWardClick(w.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: `1.5px solid ${isSel ? '#ffffff' : color + '55'}`,
                  background: isSel ? color : 'rgba(255,255,255,0.03)',
                  color: isSel ? '#0a0f1e' : 'var(--color-text)',
                  boxShadow: isSel ? `0 0 12px ${color}` : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {w.shortName} ({score})
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SVG Map Frame ── */}
      <div style={{ position: 'relative', width: '100%', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: 'auto', display: 'block', background: '#0a0f1e' }}
          aria-label="Jeevanpur Valley Ward Risk Map"
        >
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
              <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
            </pattern>
          </defs>

          {/* Terrain contour lines */}
          {[1, 2, 3].map(i => (
            <ellipse key={i} cx={W/2} cy={H/2} rx={120*i} ry={80*i}
              fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}

          {/* Ward Polygons */}
          {WARDS.map(ward => {
            const score = ward.riskScores[scenarioKey];
            const isSelected = ward.id === selectedWardId;
            const isHovered  = ward.id === hoverWard;
            const isCritical = score >= 75 && scenarioKey === 'CRITICAL';

            return (
              <g key={ward.id}>
                <path
                  d={WARD_PATHS[ward.id]}
                  fill={wardFill(score, scenarioKey)}
                  stroke={isSelected ? '#ffffff' : isHovered ? '#60a5fa' : wardStroke(score)}
                  strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                  style={{
                    cursor: 'pointer',
                    transition: 'fill 0.4s ease, stroke 0.3s ease',
                    animation: isCritical ? 'wardPulse 1.8s ease-in-out infinite' : 'none',
                    filter: isCritical ? 'url(#glow-red)' : 'none',
                  }}
                  onClick={() => onWardClick && onWardClick(ward.id)}
                  onMouseEnter={() => setHoverWard(ward.id)}
                  onMouseLeave={() => setHoverWard(null)}
                />
                {isSelected && (
                  <path d={WARD_PATHS[ward.id]} fill="url(#hatch)" pointerEvents="none" />
                )}
              </g>
            );
          })}

          {/* River Stream */}
          <path
            d={RIVER_PATH}
            fill="none"
            stroke="#60a5fa"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={scenarioKey === 'CRITICAL' ? '0' : '6 3'}
            style={{ opacity: 0.75 }}
          />
          <text x="305" y="250" fill="#60a5fa" fontSize="9" opacity="0.8"
            transform="rotate(-30,305,250)" fontFamily="Inter,sans-serif" fontWeight="600">
            Jeevan Stream
          </text>

          {/* East Bridge */}
          <g style={{ cursor: 'pointer' }}>
            <rect
              x={BRIDGE.x - 20} y={BRIDGE.y - 8}
              width={40} height={16}
              fill={bridgeClosed ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.25)'}
              stroke={bridgeClosed ? '#ef4444' : '#22c55e'}
              strokeWidth={1.5} rx={3}
              filter={bridgeClosed ? 'url(#glow-red)' : 'none'}
            />
            <text x={BRIDGE.x} y={BRIDGE.y + 4}
              textAnchor="middle" fill={bridgeClosed ? '#ef4444' : '#22c55e'}
              fontSize="7.5" fontWeight="900" fontFamily="Inter,sans-serif" letterSpacing="0.05em">
              {bridgeClosed ? 'BRIDGE CLOSED' : 'BRIDGE OPEN'}
            </text>
          </g>

          {/* Safe Route */}
          {showSafeRoute && (
            <g>
              <path
                d={SAFE_ROUTE_PATH}
                fill="none"
                stroke="#22c55e"
                strokeWidth={3.5}
                strokeDasharray="8 4"
                strokeLinecap="round"
                markerEnd="url(#arrowhead)"
                filter="url(#glow-green)"
                style={{ animation: 'routePulse 2s ease-in-out infinite' }}
              />
              <text x="185" y="188" fill="#22c55e" fontSize="8.5" fontWeight="900"
                fontFamily="Inter,sans-serif" opacity="0.95" letterSpacing="0.05em">
                SAFE ROUTE
              </text>
            </g>
          )}

          {/* Ward Labels */}
          {WARDS.map(ward => {
            const score = ward.riskScores[scenarioKey];
            const isSelected = ward.id === selectedWardId;

            return (
              <g key={`label-${ward.id}`} onClick={() => onWardClick && onWardClick(ward.id)} style={{ cursor: 'pointer' }}>
                <text
                  x={CENTROIDS[ward.id].x}
                  y={CENTROIDS[ward.id].y}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={isSelected ? '11' : '9.5'}
                  fontWeight="800"
                  fontFamily="Inter,sans-serif"
                >
                  {ward.shortName}
                </text>
                <text
                  x={CENTROIDS[ward.id].x}
                  y={CENTROIDS[ward.id].y + 12}
                  textAnchor="middle"
                  fill={wardStroke(score)}
                  fontSize="8.5"
                  fontWeight="800"
                  fontFamily="Inter,sans-serif"
                >
                  {score}/100
                </text>
              </g>
            );
          })}

          {/* Shelter at Ward 5 */}
          <g style={{ cursor: 'pointer' }}>
            <circle cx={310} cy={52} r={12} fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth={1.5} />
            <text x={310} y={56} textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="900" fontFamily="Inter,sans-serif">
              HUB
            </text>
            <text x={310} y={74} textAnchor="middle" fill="#3b82f6" fontSize="7.5"
              fontWeight="bold" fontFamily="Inter,sans-serif" letterSpacing="0.05em">
              SHELTER
            </text>
          </g>

          {/* POI markers */}
          <g style={{ cursor: 'pointer' }}>
            <circle cx={POI_POSITIONS.POI1.x} cy={POI_POSITIONS.POI1.y} r={8} fill="rgba(239,68,68,0.3)" stroke="#ef4444" strokeWidth={1.5} />
            <text x={POI_POSITIONS.POI1.x} y={POI_POSITIONS.POI1.y + 3} textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">S</text>
          </g>

          <g style={{ cursor: 'pointer' }}>
            <circle cx={POI_POSITIONS.POI2.x} cy={POI_POSITIONS.POI2.y} r={8} fill="rgba(239,68,68,0.3)" stroke="#ef4444" strokeWidth={1.5} />
            <text x={POI_POSITIONS.POI2.x} y={POI_POSITIONS.POI2.y + 3} textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">H</text>
          </g>

          <g style={{ cursor: 'pointer' }}>
            <circle cx={POI_POSITIONS.POI3.x} cy={POI_POSITIONS.POI3.y} r={7} fill="rgba(234,179,8,0.2)" stroke="#eab308" strokeWidth={1} />
            <text x={POI_POSITIONS.POI3.x} y={POI_POSITIONS.POI3.y + 3} textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">A</text>
          </g>
        </svg>

        {/* ── Permanent Selected Ward Info Overlay ── */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          right: 12,
          background: 'rgba(7, 10, 25, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{activeWardObj.name} ({activeWardObj.shortName})</span>
              <span style={{
                fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                background: wardFill(activeWardScore, scenarioKey),
                color: wardStroke(activeWardScore), fontWeight: 900,
              }}>
                Risk Score: {activeWardScore}/100
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-muted-bright)', marginTop: '2px' }}>
              Population: {activeWardObj.population.toLocaleString()} · Elevation: {activeWardObj.elevation}m · Vulnerable: {activeWardObj.vulnerableCount.total}
            </div>
          </div>

          <div style={{ fontSize: '11px', fontWeight: 700, color: wardStroke(activeWardScore) }}>
            {activeWardScore >= 75 ? 'MANDATORY EVACUATION' : activeWardScore >= 50 ? 'HIGH WATCH' : 'NORMAL MONITORING'}
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <MapLegend showSafeRoute={showSafeRoute} bridgeClosed={bridgeClosed} />
    </div>
  );
}

function MapLegend({ showSafeRoute, bridgeClosed }) {
  const items = [
    { color: '#22c55e', label: 'Normal' },
    { color: '#eab308', label: 'Watch' },
    { color: '#f97316', label: 'Warning' },
    { color: '#ef4444', label: 'Critical' },
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
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
        Bridge: {bridgeClosed ? 'CLOSED' : 'Open'}
      </div>
      <div style={{ fontSize: 11, color: '#94a3b8' }}>S: School · H: Health · A: Anganwadi</div>
    </div>
  );
}
