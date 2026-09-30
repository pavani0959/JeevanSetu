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
import LeafletWardMap      from '../components/map/LeafletWardMap';
import MLPredictionPanel   from '../components/panels/MLPredictionPanel';
import LiveWeatherPanel    from '../components/panels/LiveWeatherPanel';
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
import DataSourcePanel        from '../components/panels/DataSourcePanel';
import RoleSwitcher from '../components/shared/RoleSwitcher';

export default function Dashboard() {
  const scenarioCtx  = useScenario();
  const connectivity = useConnectivity();

  // Language state (defaults to Hindi bilingual mode for rural intuitiveness)
  const [isHindi, setIsHindi] = useState(true);

  // Role-based view state
  const [activeRole, setActiveRole] = useState('ADMIN');
  const isVolunteer = activeRole === 'VOLUNTEER';

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
        <main className="dashboard-main-grid" style={{
          display: 'grid',
          gridTemplateColumns: isVolunteer ? '1fr' : '300px 1fr 310px',
          gap: '16px',
          padding: '16px 20px',
          maxWidth: '1920px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}>

          {/* ── ROLE SWITCHER (Always visible) ───────────────── */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px', gridColumn: isVolunteer ? '1 / -1' : 'auto', marginBottom: isVolunteer ? '0' : '0' }}>
            <Card title={isHindi ? "उपयोगकर्ता भूमिका — Role" : "User Role View"}>
              <RoleSwitcher activeRole={activeRole} setActiveRole={setActiveRole} isHindi={isHindi} />
            </Card>

            {/* ── LEFT SIDEBAR (Hides in Volunteer mode) ────────── */}
            {!isVolunteer && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              </div>
            )}
          </aside>

          {/* ── CENTRE — Map + Emergency Alert ──────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Card
              title={isHindi ? "जीवनपुर घाटी — चमोली, उत्तराखंड (वास्तविक स्थान)" : "Ward Risk Map — Chamoli, Uttarakhand (Real Himalayan Terrain)"}
              titleRight={
                <span style={{
                  fontSize: '10px',
                  background: 'rgba(34,197,94,0.12)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  color: '#22c55e',
                  padding: '2px 8px',
                  borderRadius: 12,
                  fontWeight: 700,
                }}>
                  🗺️ OpenStreetMap · Live Tiles
                </span>
              }
              style={{ flex: 1 }}
            >
              <LeafletWardMap
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
          <aside className="dashboard-right-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* 🌐 Live Weather — Open-Meteo API (Chamoli, Uttarakhand) */}
            <Card title={isHindi ? "वास्तविक मौसम — चमोली, उत्तराखंड" : "Live Weather — Chamoli, Uttarakhand"}>
              <LiveWeatherPanel />
            </Card>

            {/* 🤖 ML Risk Prediction — Random Forest (98.3% accuracy) */}
            <Card title={isHindi ? "ML खतरे का पूर्वानुमान (Random Forest)" : "ML Risk Prediction — Random Forest Model"}>
              <MLPredictionPanel
                rainfall={liveRainfall}
                soil={liveSoil}
                stream={liveStream}
                terrain={0.92}
              />
            </Card>

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
        <section className="dashboard-section-2col" style={{
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

        {/* ── SECTION 7 — Data Source Transparency ─────────────── */}
        <section style={{
          padding: '0 20px 16px',
          maxWidth: '1920px',
          margin: '0 auto',
          width: '100%',
        }}>
          <Card title={isHindi ? "डेटा स्रोत — पारदर्शिता रिपोर्ट" : "Data Source Transparency — IMD / CWC / NRSC / Open-Meteo"}>
            <DataSourcePanel isHindi={isHindi} />
          </Card>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────── */}
        <Footer currentTime={currentTime} />
      </div>
    </div>
  );
}
