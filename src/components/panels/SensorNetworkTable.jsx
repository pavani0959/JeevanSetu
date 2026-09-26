import { useState } from 'react';

const SENSORS = [
  {
    id: 'STN-01',
    name: 'North Ravine Gauge (Ward 4)',
    type: 'Rainfall & TDR Soil',
    location: 'Elev. 1,420m',
    status: 'ACTIVE',
    battery: '94%',
    signal: '-64 dBm',
    lastPing: '2s ago',
    reading: '126.4 mm/hr',
    severity: 'CRITICAL',
  },
  {
    id: 'STN-02',
    name: 'East River Bend Hydro Node',
    type: 'Ultrasonic Water Level',
    location: 'Elev. 980m',
    status: 'ACTIVE',
    battery: '88%',
    signal: '-71 dBm',
    lastPing: '1s ago',
    reading: '3.82 m (+0.4m/10m)',
    severity: 'WARNING',
  },
  {
    id: 'STN-03',
    name: 'Upper Ridge Weather Station',
    type: 'Barometric & Wind Matrix',
    location: 'Elev. 1,850m',
    status: 'ACTIVE',
    battery: '99%',
    signal: '-58 dBm',
    lastPing: '4s ago',
    reading: '994 hPa · 42 km/h',
    severity: 'WATCH',
  },
  {
    id: 'STN-04',
    name: 'West Slope Soil Saturation',
    type: 'Multi-Depth Moisture Sensor',
    location: 'Elev. 1,210m',
    status: 'ACTIVE',
    battery: '91%',
    signal: '-68 dBm',
    lastPing: '3s ago',
    reading: '78.5% Saturation',
    severity: 'WATCH',
  },
  {
    id: 'STN-05',
    name: 'Central Market Culvert Monitor',
    type: 'Flow & Turbidity Node',
    location: 'Elev. 840m',
    status: 'ACTIVE',
    battery: '82%',
    signal: '-76 dBm',
    lastPing: '5s ago',
    reading: '1.45 m/s Flow',
    severity: 'NORMAL',
  },
  {
    id: 'STN-06',
    name: 'Hilltop Reservoir Intake',
    type: 'Pressure Transducer',
    location: 'Elev. 1,600m',
    status: 'ACTIVE',
    battery: '96%',
    signal: '-62 dBm',
    lastPing: '2s ago',
    reading: '92% Capacity',
    severity: 'NORMAL',
  },
];

const SEVERITY_COLORS = {
  CRITICAL: '#ef4444',
  WARNING: '#f97316',
  WATCH: '#eab308',
  NORMAL: '#22c55e',
};

export default function SensorNetworkTable({ scenarioKey }) {
  const [filter, setFilter] = useState('ALL');

  const filteredSensors = SENSORS.filter(s => {
    if (filter === 'ALL') return true;
    if (filter === 'CRITICAL') return s.severity === 'CRITICAL' || s.severity === 'WARNING';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
            Field Sensor Network Telemetry
          </span>
          <span style={{
            fontSize: '10px',
            padding: '2px 8px',
            borderRadius: '9999px',
            background: 'rgba(34,197,94,0.15)',
            color: '#22c55e',
            border: '1px solid rgba(34,197,94,0.3)',
            fontWeight: 600,
          }}>
            6/6 STATIONS ONLINE
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'CRITICAL'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid var(--color-border)',
                background: filter === f ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.03)',
                color: filter === f ? '#60a5fa' : 'var(--color-muted)',
                transition: 'all 0.2s',
              }}
            >
              {f === 'ALL' ? 'All Stations' : 'High Priority Only'}
            </button>
          ))}
        </div>
      </div>

      {/* Sensor Table */}
      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--color-muted-bright)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Station ID & Name</th>
              <th style={{ padding: '10px 12px', fontWeight 600 }}>Sensor Type</th>
              <th style={{ padding: '10px 12px', fontWeight 600 }}>Elevation</th>
              <th style={{ padding: '10px 12px', fontWeight 600 }}>Live Telemetry</th>
              <th style={{ padding: '10px 12px', fontWeight 600 }}>Battery & Signal</th>
              <th style={{ padding: '10px 12px', fontWeight 600 }}>Node Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSensors.map((s, idx) => {
              const color = SEVERITY_COLORS[s.severity];
              return (
                <tr
                  key={s.id}
                  style={{
                    borderBottom: idx === filteredSensors.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    transition: 'background 0.2s',
                  }}
                >
                  <td style={{ padding: '10px 12px', color: 'var(--color-text)' }}>
                    <div style={{ fontWeight: 700 }}>{s.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-muted)' }}>{s.id}</div>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--color-muted-bright)' }}>{s.type}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--color-muted)' }}>{s.location}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>
                    {s.reading}
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--color-muted-bright)', fontSize: '11px' }}>
                    <span>BAT: {s.battery}</span>
                    <span style={{ margin: '0 6px', opacity: 0.4 }}>|</span>
                    <span>SIG: {s.signal}</span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        width: 7, height: 7, borderRadius: '50%', background: color,
                        boxShadow: `0 0 6px ${color}`,
                      }} />
                      <span style={{ fontWeight: 700, fontSize: '11px', color }}>{s.severity}</span>
                    </div>
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
