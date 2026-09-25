import { useState, useEffect } from 'react';

// Layout
import NavBar              from '../components/shared/NavBar';
import DemoModeBanner      from '../components/shared/DemoModeBanner';
import OfflineBanner       from '../components/shared/OfflineBanner';
import RainCanvas          from '../components/shared/RainCanvas';
import Card                from '../components/shared/Card';

// Hooks
import { useScenario }     from '../hooks/useScenario';
import { useConnectivity } from '../hooks/useConnectivity';
import { runSelfTest }     from '../engine/riskEngine';

// Phase 3 — Map & Monitoring
import WardMap             from '../components/map/WardMap';
import TelemetryBar        from '../components/panels/TelemetryBar';
import RiskScorePanel      from '../components/panels/RiskScorePanel';
import MicroTrendPanel     from '../components/panels/MicroTrendPanel';
import WardInfoPanel       from '../components/panels/WardInfoPanel';

// Phase 4 — Evacuation & Alerts
import EvacuationPanel     from '../components/panels/EvacuationPanel';
import ShelterCard         from '../components/panels/ShelterCard';
import PriorityPanel       from '../components/panels/PriorityPanel';
import AlertPanel          from '../components/alerts/AlertPanel';
import AlertFeed           from '../components/alerts/AlertFeed';

// Phase 5 — Simulator & Polish
import SimulatorPanel      from '../components/panels/SimulatorPanel';
import RiskPropagationView from '../components/panels/RiskPropagationView';

export default function Dashboard() {
  const scenarioCtx  = useScenario();
  const connectivity = useConnectivity();

  const {
    scenarioKey, setScenario,
    liveRainfall, liveSoil, liveStream,
    riskResult, riskState, riskScore,
    selectedWardId, setSelectedWardId,
    isAutoPlay, setIsAutoPlay,
    setRainfallOverride,
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

  useEffect(() => { runSelfTest(); }, []);

  // Rainfall override for slider (passed into SimulatorPanel)
  const [rainfallOverride, setLocalRainfallOverride] = useState(null);
  const handleRainfallOverride = (val) => {
    setLocalRainfallOverride(val);
    setRainfallOverride(val);
  };

  const rainIntensity = riskState === 'CRITICAL' ? 2.8 : riskState === 'WARNING' ? 2.0 : riskState === 'WATCH' ? 1.4 : 1.0;

  return (
    /* Add state class to root so CSS can apply CRITICAL edge glow */
    <div className={`state-${riskState.toLowerCase()}`}>
      <div className="app-wrapper">
        {/* Animated rain — intensity scales with risk */}
        <RainCanvas intensity={rainIntensity} />

        {/* Persistent banners */}
        <DemoModeBanner />
        <OfflineBanner visible={isOffline} />

        {/* Top navigation */}
        <NavBar riskState={riskState} currentTime={currentTime} />

        {/* ── TELEMETRY BAR ──────────────────────────────────── */}
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

        {/* ── MAIN 3-COLUMN GRID ─────────────────────────────── */}
        <main style={{
          display: 'grid',
          gridTemplateColumns: '276px 1fr 296px',
          gap: '10px',
          padding: '10px 16px',
          maxWidth: '1920px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}>

          {/* ── LEFT SIDEBAR ──────────────────────────────────── */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* Simulator Panel — Phase 5 (replaces temp buttons) */}
            <Card title="Cloudburst Simulator">
              <SimulatorPanel
                scenarioKey={scenarioKey}
                setScenario={setScenario}
                isAutoPlay={isAutoPlay}
                setIsAutoPlay={setIsAutoPlay}
                rainfallOverride={rainfallOverride}
                setRainfallOverride={handleRainfallOverride}
                isOffline={isOffline}
                toggleDemoOffline={toggleDemoOffline}
              />
            </Card>

            {/* Risk Propagation */}
            <Card title="Risk Propagation">
              <RiskPropagationView scenarioKey={scenarioKey} />
            </Card>

            {/* Ward Info Panel */}
            <Card title="Ward Details" style={{ flex: 1 }}>
              <WardInfoPanel
                selectedWardId={selectedWardId}
                scenarioKey={scenarioKey}
                onWardChange={setSelectedWardId}
              />
            </Card>
          </aside>

          {/* ── CENTRE — Map + Alert ──────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Card
              title="Ward Risk Map — Jeevanpur Valley"
              titleRight={
                <span style={{ fontSize: '10px', color: 'var(--color-muted)' }}>
                  Click ward · Hover for details
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

            {/* Emergency Alert below map */}
            <Card title="🚨 Emergency Alert">
              <AlertPanel scenarioKey={scenarioKey} />
            </Card>
          </div>

          {/* ── RIGHT SIDEBAR ─────────────────────────────────── */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

            <Card title="Risk Score — Ward 4">
              <RiskScorePanel riskResult={riskResult} scenarioKey={scenarioKey} />
            </Card>

            <Card title="Last 30 Min — Rate of Change">
              <MicroTrendPanel scenarioKey={scenarioKey} />
            </Card>

            <Card title="Evacuation">
              <EvacuationPanel scenarioKey={scenarioKey} />
            </Card>

            <Card title="Shelter Status">
              <ShelterCard scenarioKey={scenarioKey} />
            </Card>
          </aside>
        </main>

        {/* ── BOTTOM ROW — Priority + Alert Feed ───────────── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          padding: '0 16px 18px',
          maxWidth: '1920px',
          margin: '0 auto',
          width: '100%',
        }}>
          <Card title="Priority Assistance">
            <PriorityPanel scenarioKey={scenarioKey} />
          </Card>
          <Card title="Alert Feed — Response Timeline">
            <AlertFeed scenarioKey={scenarioKey} />
          </Card>
        </section>
      </div>
    </div>
  );
}
