import { useState, useEffect } from 'react';
import NavBar from '../components/shared/NavBar';
import DemoModeBanner from '../components/shared/DemoModeBanner';
import OfflineBanner from '../components/shared/OfflineBanner';
import RainCanvas from '../components/shared/RainCanvas';
import Card from '../components/shared/Card';
import { useScenario } from '../hooks/useScenario';
import { useConnectivity } from '../hooks/useConnectivity';
import { runSelfTest } from '../engine/riskEngine';

/**
 * Dashboard — main page layout
 * Grid: left sidebar | centre map | right panels
 * This is the assembly point — panels are imported here phase by phase.
 */
export default function Dashboard() {
  // ── Phase 2 hooks ──────────────────────────────────────────
  const scenarioCtx  = useScenario();
  const connectivity = useConnectivity();

  const {
    scenarioKey, setScenario,
    liveRainfall, liveSoil, liveStream,
    riskResult,
  } = scenarioCtx;

  const { isOffline, toggleDemoOffline } = connectivity;

  // Live clock
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Run risk engine self-test on first load — visible in browser console
  useEffect(() => { runSelfTest(); }, []);

  return (
    <div className="app-wrapper">
      {/* Animated rain background — more intense at higher risk */}
      <RainCanvas intensity={scenarioKey === 'CRITICAL' ? 2.2 : scenarioKey === 'WARNING' ? 1.6 : 1} />

      {/* Persistent banners */}
      <DemoModeBanner />
      <OfflineBanner visible={isOffline} />

      {/* Top nav */}
      <NavBar riskState={riskResult.state} currentTime={currentTime} />

      {/* Main content area — 3-column grid */}
      <main
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr 320px',
          gridTemplateRows: 'auto 1fr',
          gap: '12px',
          padding: '12px 16px 16px',
          minHeight: 'calc(100vh - 88px)',
          maxWidth: '1920px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* ── LEFT SIDEBAR ─────────────────────────────────── */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '12px', gridRow: '1 / 3' }}>

          {/* Temporary scenario switcher — will be replaced by SimulatorPanel in Phase 5 */}
          <Card title="Scenario Simulator">
            <p style={{ color: 'var(--color-muted)', fontSize: '11px', marginBottom: '10px' }}>
              Full simulator panel → Phase 5
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['NORMAL', 'WATCH', 'WARNING', 'CRITICAL'].map(s => (
                <button
                  key={s}
                  id={`scenario-btn-${s.toLowerCase()}`}
                  onClick={() => setScenario(s)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${scenarioKey === s ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    background: scenarioKey === s ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                    color: scenarioKey === s ? 'var(--color-accent)' : 'var(--color-muted-bright)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    letterSpacing: '0.06em',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>

          {/* Ward info — placeholder until Phase 3 */}
          <Card title="Ward Info" style={{ flex: 1 }}>
            <p style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
              Phase 3 — Ward details appear here when you click a ward on the map.
            </p>
          </Card>

          {/* Offline toggle */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-muted-bright)' }}>
                📶 Simulate Offline
              </span>
              <button
                id="offline-toggle"
                onClick={toggleDemoOffline}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${isOffline ? 'rgba(96,165,250,0.4)' : 'var(--color-border)'}`,
                  background: isOffline ? 'rgba(96,165,250,0.1)' : 'transparent',
                  color: isOffline ? 'var(--color-rain)' : 'var(--color-muted)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {isOffline ? 'ON' : 'OFF'}
              </button>
            </div>
          </Card>
        </aside>

        {/* ── CENTRE TOP — Live telemetry bar ──────────────── */}
        <div style={{ gridColumn: '2', gridRow: '1' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <TelemetryItem
                label="🌧 Rainfall"
                value={liveRainfall.toFixed(1)}
                unit="mm/hr"
                color="var(--color-rain)"
              />
              <TelemetryItem
                label="💧 Soil"
                value={liveSoil.toFixed(0)}
                unit="%"
                color="var(--color-soil)"
              />
              <TelemetryItem
                label="🌊 Stream"
                value={liveStream.toFixed(1)}
                unit="m"
                color="var(--color-stream)"
              />
              <TelemetryItem
                label="⚠️ Risk Score"
                value={`${riskResult.total}`}
                unit="/ 100"
                color={
                  riskResult.state === 'CRITICAL' ? 'var(--color-critical)' :
                  riskResult.state === 'WARNING'  ? 'var(--color-warning)'  :
                  riskResult.state === 'WATCH'    ? 'var(--color-watch)'    :
                  'var(--color-normal)'
                }
              />
              <div style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                Live · updates every 3s
              </div>
            </div>
          </Card>
        </div>

        {/* ── CENTRE MAIN — Map placeholder ────────────────── */}
        <div style={{ gridColumn: '2', gridRow: '2' }}>
          <Card style={{ height: '100%', minHeight: '400px' }} title="Ward Risk Map — Jeevanpur Valley">
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '340px', color: 'var(--color-muted)', fontSize: '14px',
                flexDirection: 'column', gap: '8px',
              }}
            >
              <span style={{ fontSize: '40px' }}>🗺️</span>
              <span>Phase 3 — SVG Ward Map built here</span>
              <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                5 wards · river · East Bridge · shelter · POI markers (school, health, anganwadi)
              </span>
            </div>
          </Card>
        </div>

        {/* ── RIGHT SIDEBAR ────────────────────────────────── */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '12px', gridRow: '1 / 3' }}>
          <Card title="Risk Score">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                fontSize: '48px', fontWeight: 900,
                color: riskResult.state === 'CRITICAL' ? 'var(--color-critical)' :
                       riskResult.state === 'WARNING'  ? 'var(--color-warning)'  :
                       riskResult.state === 'WATCH'    ? 'var(--color-watch)'    :
                       'var(--color-normal)',
                transition: 'color 0.5s ease',
              }}>
                {riskResult.total}
              </div>
              <div style={{ color: 'var(--color-muted)', fontSize: '12px' }}>/ 100</div>
              <div style={{ marginTop: '12px', color: 'var(--color-muted)', fontSize: '11px' }}>
                Phase 3 — gauge + breakdown bars
              </div>
              {/* Preview the breakdown scores */}
              <div style={{ marginTop: '14px', textAlign: 'left', fontSize: '11px', color: 'var(--color-muted-bright)' }}>
                <div>☁️ Rainfall: {riskResult.breakdown.rainfall} / 40</div>
                <div>💧 Soil:     {riskResult.breakdown.soil} / 25</div>
                <div>🌊 Stream:   {riskResult.breakdown.stream} / 20</div>
                <div>⛰️ Terrain:  {riskResult.breakdown.terrain} / 15</div>
              </div>
            </div>
          </Card>

          <Card title="Last 30 Min Trend">
            <div style={{ color: 'var(--color-muted)', fontSize: '12px', padding: '8px 0' }}>
              Phase 3 — Sparklines here
            </div>
          </Card>

          <Card title="Evacuation">
            <div style={{ color: 'var(--color-muted)', fontSize: '12px', padding: '8px 0' }}>
              Phase 4 — Safe/unsafe routes
            </div>
          </Card>

          <Card title="Shelter Status">
            <div style={{ color: 'var(--color-muted)', fontSize: '12px', padding: '8px 0' }}>
              Phase 4 — Capacity bar
            </div>
          </Card>
        </aside>
      </main>

      {/* ── BOTTOM — Alert + Priority + Feed ─────────────── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          padding: '0 16px 16px',
          maxWidth: '1920px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Card title="Emergency Alert">
          <div style={{ color: 'var(--color-muted)', fontSize: '12px', padding: '8px 0' }}>
            Phase 4 — English/Hindi alert card
          </div>
        </Card>
        <Card title="Priority Assistance">
          <div style={{ color: 'var(--color-muted)', fontSize: '12px', padding: '8px 0' }}>
            Phase 4 — Vulnerable residents + POIs
          </div>
        </Card>
        <Card title="Alert Feed">
          <div style={{ color: 'var(--color-muted)', fontSize: '12px', padding: '8px 0' }}>
            Phase 4 — Acknowledgement timeline
          </div>
        </Card>
      </section>
    </div>
  );
}

/* ── Helper: single telemetry reading ── */
function TelemetryItem({ label, value, unit, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontSize: '10px', color: 'var(--color-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ fontSize: '20px', fontWeight: 700, color, fontVariantNumeric: 'tabular-nums', transition: 'color 0.4s' }}>
        {value}{' '}
        <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--color-muted)' }}>{unit}</span>
      </span>
    </div>
  );
}
