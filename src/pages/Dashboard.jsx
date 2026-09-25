import { useState, useEffect } from 'react';

// Layout
import NavBar           from '../components/shared/NavBar';
import DemoModeBanner   from '../components/shared/DemoModeBanner';
import OfflineBanner    from '../components/shared/OfflineBanner';
import RainCanvas       from '../components/shared/RainCanvas';
import Card             from '../components/shared/Card';

// Hooks
import { useScenario }     from '../hooks/useScenario';
import { useConnectivity } from '../hooks/useConnectivity';

// Engine
import { runSelfTest } from '../engine/riskEngine';

// Phase 3 components
import WardMap          from '../components/map/WardMap';
import TelemetryBar     from '../components/panels/TelemetryBar';
import RiskScorePanel   from '../components/panels/RiskScorePanel';
import MicroTrendPanel  from '../components/panels/MicroTrendPanel';
import WardInfoPanel    from '../components/panels/WardInfoPanel';

export default function Dashboard() {
  // ── Hooks ──────────────────────────────────────────────────
  const scenarioCtx  = useScenario();
  const connectivity = useConnectivity();

  const {
    scenarioKey, setScenario,
    liveRainfall, liveSoil, liveStream,
    riskResult, riskState, riskScore,
    selectedWardId, setSelectedWardId,
    microTrend,
  } = scenarioCtx;

  const { isOffline, toggleDemoOffline } = connectivity;

  // Live clock
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Risk engine self-test on first load
  useEffect(() => { runSelfTest(); }, []);

  return (
    <div className="app-wrapper">
      {/* Animated rain background — intensifies with risk */}
      <RainCanvas intensity={riskState === 'CRITICAL' ? 2.5 : riskState === 'WARNING' ? 1.8 : 1} />

      {/* Persistent banners */}
      <DemoModeBanner />
      <OfflineBanner visible={isOffline} />

      {/* Top nav */}
      <NavBar riskState={riskState} currentTime={currentTime} />

      {/* ── TELEMETRY BAR (full width below nav) ─────────── */}
      <div style={{ padding: '10px 16px 0', maxWidth: '1920px', margin: '0 auto', width: '100%' }}>
        <Card noPad>
          <TelemetryBar
            scenarioKey={scenarioKey}
            liveRainfall={liveRainfall}
            liveSoil={liveSoil}
            liveStream={liveStream}
            riskScore={riskScore}
            riskState={riskState}
          />
        </Card>
      </div>

      {/* ── MAIN 3-COLUMN GRID ───────────────────────────── */}
      <main style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr 300px',
        gap: '10px',
        padding: '10px 16px 14px',
        minHeight: 'calc(100vh - 140px)',
        maxWidth: '1920px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>

        {/* ── LEFT SIDEBAR ─────────────────────────────────── */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Scenario switcher (temporary, replaced by SimulatorPanel in Phase 5) */}
          <Card title="Scenario">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { key: 'NORMAL',   sub: '12 mm/hr' },
                { key: 'WATCH',    sub: '42 mm/hr' },
                { key: 'WARNING',  sub: '78 mm/hr' },
                { key: 'CRITICAL', sub: '126 mm/hr · CLOUDBURST' },
              ].map(({ key, sub }) => (
                <button
                  key={key}
                  id={`scenario-btn-${key.toLowerCase()}`}
                  onClick={() => setScenario(key)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: `1.5px solid ${scenarioKey === key ? getRiskColor(key) : 'var(--color-border)'}`,
                    background: scenarioKey === key ? `${getRiskColor(key)}18` : 'rgba(255,255,255,0.02)',
                    color: scenarioKey === key ? getRiskColor(key) : 'var(--color-muted-bright)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.25s ease',
                    boxShadow: scenarioKey === key ? `0 0 12px ${getRiskColor(key)}30` : 'none',
                  }}
                >
                  <div>{key}</div>
                  <div style={{ fontSize: '10px', fontWeight: 400, opacity: 0.7, marginTop: '1px' }}>{sub}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Ward Info */}
          <Card title="Ward Details" style={{ flex: 1 }}>
            <WardInfoPanel
              selectedWardId={selectedWardId}
              scenarioKey={scenarioKey}
              onWardChange={setSelectedWardId}
            />
          </Card>

          {/* Offline toggle */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-muted-bright)' }}>📶 Simulate Offline</span>
              <button
                id="offline-toggle"
                onClick={toggleDemoOffline}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${isOffline ? 'rgba(96,165,250,0.4)' : 'var(--color-border)'}`,
                  background: isOffline ? 'rgba(96,165,250,0.1)' : 'transparent',
                  color: isOffline ? 'var(--color-rain)' : 'var(--color-muted)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {isOffline ? 'ON' : 'OFF'}
              </button>
            </div>
          </Card>
        </aside>

        {/* ── CENTRE — Map ─────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Card
            title="Ward Risk Map — Jeevanpur Valley"
            titleRight={
              <span style={{ fontSize: '10px', color: 'var(--color-muted)' }}>
                Click ward to inspect · Hover for details
              </span>
            }
            style={{ flex: 1 }}
          >
            <WardMap
              scenarioKey={scenarioKey}
              selectedWardId={selectedWardId}
              onWardClick={setSelectedWardId}
            />
          </Card>
        </div>

        {/* ── RIGHT SIDEBAR ────────────────────────────────── */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Risk Score + Breakdown */}
          <Card title="Risk Score — Ward 4">
            <RiskScorePanel riskResult={riskResult} scenarioKey={scenarioKey} />
          </Card>

          {/* Micro-trend sparklines */}
          <Card title="Last 30 Min — Rate of Change" style={{ flex: 1 }}>
            <MicroTrendPanel scenarioKey={scenarioKey} />
          </Card>

          {/* Phase 4 placeholders */}
          <Card title="Evacuation">
            <p style={{ color: 'var(--color-muted)', fontSize: '11px' }}>Phase 4 — Unsafe/safe routes</p>
          </Card>

          <Card title="Shelter Status">
            <p style={{ color: 'var(--color-muted)', fontSize: '11px' }}>Phase 4 — Capacity bar</p>
          </Card>
        </aside>
      </main>

      {/* ── BOTTOM SECTION — Phase 4 placeholders ────────── */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '10px',
        padding: '0 16px 16px',
        maxWidth: '1920px',
        margin: '0 auto',
        width: '100%',
      }}>
        <Card title="Emergency Alert">
          <p style={{ color: 'var(--color-muted)', fontSize: '11px' }}>Phase 4 — English/Hindi alert card</p>
        </Card>
        <Card title="Priority Assistance">
          <p style={{ color: 'var(--color-muted)', fontSize: '11px' }}>Phase 4 — Vulnerable residents + POIs</p>
        </Card>
        <Card title="Alert Feed">
          <p style={{ color: 'var(--color-muted)', fontSize: '11px' }}>Phase 4 — Acknowledgement timeline</p>
        </Card>
      </section>
    </div>
  );
}

function getRiskColor(key) {
  return key === 'CRITICAL' ? '#ef4444' : key === 'WARNING' ? '#f97316' : key === 'WATCH' ? '#eab308' : '#22c55e';
}
