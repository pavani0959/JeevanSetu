import { useState, useEffect } from 'react';

// Layout
import NavBar              from '../components/shared/NavBar';
import OfflineBanner       from '../components/shared/OfflineBanner';
import RainCanvas          from '../components/shared/RainCanvas';
import Card                from '../components/shared/Card';
import Footer              from '../components/shared/Footer';

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

// Village Quick Guide & Extended Content — Simulator, Matrix Tables & SOPs
import VillageQuickGuide      from '../components/panels/VillageQuickGuide';
import SimulatorPanel         from '../components/panels/SimulatorPanel';
import RiskPropagationView    from '../components/panels/RiskPropagationView';
import SensorNetworkTable     from '../components/panels/SensorNetworkTable';
import WardRiskMatrixTable    from '../components/panels/WardRiskMatrixTable';
import EmergencySOPGuide      from '../components/panels/EmergencySOPGuide';
import ControlCenterDirectory from '../components/panels/ControlCenterDirectory';

export default function Dashboard() {
  const scenarioCtx  = useScenario();
  const connectivity = useConnectivity();

  // Language state (defaults to Hindi bilingual mode for rural intuitiveness)
  const [isHindi, setIsHindi] = useState(true);

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

  // Rainfall override for slider
  const [rainfallOverride, setLocalRainfallOverride] = useState(null);
  const handleRainfallOverride = (val) => {
    setLocalRainfallOverride(val);
    setRainfallOverride(val);
  };

  const rainIntensity = riskState === 'CRITICAL' ? 2.8 : riskState === 'WARNING' ? 2.0 : riskState === 'WATCH' ? 1.4 : 1.0;

  return (
    <div className={`state-${riskState.toLowerCase()}`}>
      <div className="app-wrapper">
        {/* Animated rain background */}
        <RainCanvas intensity={rainIntensity} />

        {/* Floating offline indicator */}
        <OfflineBanner visible={isOffline} />

        {/* Top sticky navigation bar */}
        <NavBar
          riskState={riskState}
          currentTime={currentTime}
          isHindi={isHindi}
          setIsHindi={setIsHindi}
        />

        {/* ── VILLAGE INTUITIVE QUICK GUIDE — 3-Second Action Banner ── */}
        <div style={{ padding: '16px 20px 0', maxWidth: '1920px', margin: '0 auto', width: '100%' }}>
          <VillageQuickGuide scenarioKey={scenarioKey} isHindi={isHindi} />
        </div>

        {/* ── TELEMETRY STRIP ──────────────────────────────────── */}
        <div style={{ padding: '16px 20px 0', maxWidth: '1920px', margin: '0 auto', width: '100%' }}>
          <Card noPad>
            <TelemetryBar
              scenarioKey={scenarioKey}
              liveRainfall={liveRainfall}
              liveSoil={liveSoil}
              liveStream={liveStream}
              riskScore={riskScore}
              riskState={riskState}
              isHindi={isHindi}
            />
          </Card>
        </div>

        {/* ── MAIN 3-COLUMN GRID ─────────────────────────────── */}
        <main style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr 310px',
          gap: '16px',
          padding: '16px 20px',
          maxWidth: '1920px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}>

          {/* ── LEFT SIDEBAR ──────────────────────────────────── */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Cloudburst Scenario Simulator */}
            <Card title={isHindi ? "मौसम एवं परिस्थिति नियंत्रण" : "Cloudburst Scenario Controls"}>
              <SimulatorPanel
                scenarioKey={scenarioKey}
                setScenario={setScenario}
                isAutoPlay={isAutoPlay}
                setIsAutoPlay={setIsAutoPlay}
                rainfallOverride={rainfallOverride}
                setRainfallOverride={handleRainfallOverride}
                isOffline={isOffline}
                toggleDemoOffline={toggleDemoOffline}
                isHindi={isHindi}
              />
            </Card>

            {/* Risk Propagation */}
            <Card title={isHindi ? "खतरे का बहाव (Cascade Risk)" : "Cascade Risk Flow"}>
              <RiskPropagationView scenarioKey={scenarioKey} />
            </Card>

            {/* Ward Info Panel */}
            <Card title={isHindi ? "चुने गए वार्ड की जानकारी" : "Active Ward Details"} style={{ flex: 1 }}>
              <WardInfoPanel
                selectedWardId={selectedWardId}
                scenarioKey={scenarioKey}
                onWardChange={setSelectedWardId}
              />
            </Card>
          </aside>

          {/* ── CENTRE — Map + Emergency Alert ──────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Card
              title={isHindi ? "जीवनपुर घाटी — वार्ड और खतरे का नक्शा" : "Ward Risk Map — Jeevanpur Valley Basin"}
              titleRight={
                <span style={{ fontSize: '11px', color: 'var(--color-muted-bright)' }}>
                  {isHindi ? "नक्शे पर किसी भी वार्ड को दबाएँ" : "Interactive Terrain · Click ward to inspect"}
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

            {/* Emergency Broadcast Alert below map */}
            <Card title={isHindi ? "आपातकालीन सूचना (Emergency Broadcast)" : "Emergency Broadcast Alert"}>
              <AlertPanel scenarioKey={scenarioKey} />
            </Card>
          </div>

          {/* ── RIGHT SIDEBAR ─────────────────────────────────── */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <Card title={isHindi ? "वार्ड 4 — खतरे का स्कोर" : "Risk Score Analytics — Ward 4"}>
              <RiskScorePanel riskResult={riskResult} scenarioKey={scenarioKey} />
            </Card>

            <Card title={isHindi ? "पिछले 30 मिनट में बदलाव" : "30-Min Telemetry Rate of Change"}>
              <MicroTrendPanel scenarioKey={scenarioKey} />
            </Card>

            <Card title={isHindi ? "निकासी रास्ता (Safe Evacuation Path)" : "Evacuation Route Status"}>
              <EvacuationPanel scenarioKey={scenarioKey} />
            </Card>

            <Card title={isHindi ? "सुरक्षित आश्रय (Hilltop Shelter)" : "Hilltop Shelter Capacity"}>
              <ShelterCard scenarioKey={scenarioKey} />
            </Card>
          </aside>
        </main>

        {/* ── SECTION 2 — Priority Assistance & Response Timeline ── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          padding: '0 20px 16px',
          maxWidth: '1920px',
          margin: '0 auto',
          width: '100%',
        }}>
          <Card title={isHindi ? "बुजुर्ग और विशेष सहायता (Priority Assistance)" : "Vulnerable Population Priority Assistance"}>
            <PriorityPanel scenarioKey={scenarioKey} />
          </Card>
          <Card title={isHindi ? "राहत एवं बचाव की समयरेखा" : "Incident Alert & Response Timeline"}>
            <AlertFeed scenarioKey={scenarioKey} />
          </Card>
        </section>

        {/* ── SECTION 3 — Field Sensor Telemetry Matrix ───────────── */}
        <section style={{
          padding: '0 20px 16px',
          maxWidth: '1920px',
          margin: '0 auto',
          width: '100%',
        }}>
          <Card>
            <SensorNetworkTable scenarioKey={scenarioKey} />
          </Card>
        </section>

        {/* ── SECTION 4 — Ward Vulnerability & Risk Matrix ────────── */}
        <section style={{
          padding: '0 20px 16px',
          maxWidth: '1920px',
          margin: '0 auto',
          width: '100%',
        }}>
          <Card>
            <WardRiskMatrixTable
              scenarioKey={scenarioKey}
              onSelectWard={setSelectedWardId}
              selectedWardId={selectedWardId}
            />
          </Card>
        </section>

        {/* ── SECTION 5 — Standard Operating Procedures (SOPs) ────── */}
        <section style={{
          padding: '0 20px 16px',
          maxWidth: '1920px',
          margin: '0 auto',
          width: '100%',
        }}>
          <Card>
            <EmergencySOPGuide scenarioKey={scenarioKey} />
          </Card>
        </section>

        {/* ── SECTION 6 — Control Center & Helplines Directory ────── */}
        <section style={{
          padding: '0 20px',
          maxWidth: '1920px',
          margin: '0 auto',
          width: '100%',
        }}>
          <Card>
            <ControlCenterDirectory />
          </Card>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────── */}
        <Footer currentTime={currentTime} />
      </div>
    </div>
  );
}
