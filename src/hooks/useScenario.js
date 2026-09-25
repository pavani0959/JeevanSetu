/**
 * useScenario.js — Central app state hook
 *
 * Manages:
 *  - Current scenario key (NORMAL / WATCH / WARNING / CRITICAL)
 *  - Derived telemetry with live ±jitter to feel real
 *  - Risk score + breakdown from the engine
 *  - Micro-trend history
 *  - Unsafe routes + safe route
 *  - Shelter status
 *  - Alert feed entries (cumulative as scenario progresses)
 *  - Auto-play mode (cycles through all 4 states)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { SCENARIOS, SCENARIO_KEYS } from '../data/scenarios';
import { MICRO_TREND } from '../data/microTrend';
import { calculateWardRiskScore, getUnsafeInfrastructure, getSafeRoute, getActiveShelter } from '../engine/riskEngine';
import { WARDS } from '../data/wards';
import { getPOIActions } from '../data/vulnerablePOI';

/* ── Alert feed entries per scenario ───────────────────────── */
const ALERT_FEED = {
  NORMAL: [],
  WATCH: [
    { id: 'wf1', time: '21:52', type: 'sent',   text: 'Volunteer Notification SENT — Ward 3 & 4 volunteers' },
    { id: 'wf2', time: '21:54', type: 'ack',    text: 'Acknowledged — Village Volunteer (Ramesh K.) "On standby"' },
  ],
  WARNING: [
    { id: 'wf1', time: '21:52', type: 'sent',   text: 'Volunteer Notification SENT — Ward 3 & 4 volunteers' },
    { id: 'wf2', time: '21:54', type: 'ack',    text: 'Acknowledged — Village Volunteer (Ramesh K.) "On standby"' },
    { id: 'wng1', time: '22:01', type: 'sent',  text: 'WARNING Alert SENT to Ward 4 coordinator' },
    { id: 'wng2', time: '22:02', type: 'action',text: 'Shelter PREPARING — Hilltop Community School' },
    { id: 'wng3', time: '22:03', type: 'ack',   text: 'Acknowledged — Shelter Coordinator "Opening shelter"' },
  ],
  CRITICAL: [
    { id: 'wf1', time: '21:52', type: 'sent',   text: 'Volunteer Notification SENT — Ward 3 & 4 volunteers' },
    { id: 'wf2', time: '21:54', type: 'ack',    text: 'Acknowledged — Village Volunteer (Ramesh K.) "On standby"' },
    { id: 'wng1', time: '22:01', type: 'sent',  text: 'WARNING Alert SENT to Ward 4 coordinator' },
    { id: 'wng2', time: '22:02', type: 'action',text: 'Shelter PREPARING — Hilltop Community School' },
    { id: 'wng3', time: '22:03', type: 'ack',   text: 'Acknowledged — Shelter Coordinator "Opening shelter"' },
    { id: 'cr1', time: '22:04', type: 'sent',   text: 'CRITICAL Alert SENT to Ward 4 volunteer' },
    { id: 'cr2', time: '22:04', type: 'sent',   text: 'CRITICAL Alert SENT to District Response Team' },
    { id: 'cr3', time: '22:06', type: 'ack',    text: 'Acknowledged — Village Volunteer (Ramesh K.)' },
    { id: 'cr4', time: '22:07', type: 'ack',    text: 'Acknowledged — Hilltop School Shelter Coordinator' },
    { id: 'cr5', time: '22:08', type: 'action', text: 'Shelter status updated: OPEN (87/120 capacity)' },
    { id: 'cr6', time: '22:09', type: 'action', text: 'Priority evacuation initiated — 26 residents flagged' },
  ],
};

/* ── Small random jitter to simulate live readings ─────────── */
function jitter(value, maxDelta = 2) {
  return parseFloat((value + (Math.random() - 0.5) * maxDelta * 2).toFixed(1));
}

/* ── The hook ────────────────────────────────────────────────── */
export function useScenario() {
  const [scenarioKey, setScenarioKeyRaw]   = useState('NORMAL');
  const [liveRainfall, setLiveRainfall]    = useState(SCENARIOS.NORMAL.rainfall);
  const [liveSoil, setLiveSoil]            = useState(SCENARIOS.NORMAL.soil);
  const [liveStream, setLiveStream]        = useState(SCENARIOS.NORMAL.stream);
  const [selectedWardId, setSelectedWardId]= useState('W4');  // default: primary risk ward
  const [isAutoPlay, setIsAutoPlay]        = useState(false);
  const autoPlayRef = useRef(null);

  // Derived from current scenario
  const scenario    = SCENARIOS[scenarioKey];
  const microTrend  = MICRO_TREND[scenarioKey];
  const ward        = WARDS.find(w => w.id === selectedWardId);
  const wardRisk    = ward ? ward.riskScores[scenarioKey] : 0;

  // Full risk calculation using live telemetry
  const riskResult  = calculateWardRiskScore({
    rainfall:           liveRainfall,
    soil:               liveSoil,
    stream:             liveStream,
    terrainVulnerability: ward ? ward.terrainVulnerability : 0.92,
  });

  const unsafeInfra = getUnsafeInfrastructure(scenarioKey);
  const safeRoute   = getSafeRoute(scenarioKey);
  const shelter     = getActiveShelter(scenarioKey);
  const poiActions  = getPOIActions(scenarioKey);
  const alertFeed   = ALERT_FEED[scenarioKey];

  // Switch scenario — reset live telemetry to that scenario's base values
  const setScenario = useCallback((key) => {
    const s = SCENARIOS[key];
    if (!s) return;
    setScenarioKeyRaw(key);
    setLiveRainfall(s.rainfall);
    setLiveSoil(s.soil);
    setLiveStream(s.stream);
  }, []);

  // Live jitter tick — runs every 3 seconds to simulate real sensor readings
  useEffect(() => {
    const s = SCENARIOS[scenarioKey];
    const id = setInterval(() => {
      setLiveRainfall(jitter(s.rainfall, scenarioKey === 'CRITICAL' ? 4 : 2));
      setLiveSoil(    Math.min(100, Math.max(0, jitter(s.soil, 1))));
      setLiveStream(  Math.max(0,   jitter(s.stream, 0.1)));
    }, 3000);
    return () => clearInterval(id);
  }, [scenarioKey]);

  // Auto-play: cycle NORMAL → WATCH → WARNING → CRITICAL → NORMAL
  useEffect(() => {
    if (isAutoPlay) {
      autoPlayRef.current = setInterval(() => {
        setScenarioKeyRaw(prev => {
          const idx = SCENARIO_KEYS.indexOf(prev);
          const next = SCENARIO_KEYS[(idx + 1) % SCENARIO_KEYS.length];
          const s = SCENARIOS[next];
          setLiveRainfall(s.rainfall);
          setLiveSoil(s.soil);
          setLiveStream(s.stream);
          return next;
        });
      }, 3500);
    } else {
      clearInterval(autoPlayRef.current);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlay]);

  // Rainfall slider override — recalculates risk dynamically
  const setRainfallOverride = useCallback((mmPerHr) => {
    setLiveRainfall(mmPerHr);
  }, []);

  return {
    // State
    scenarioKey,
    scenario,
    selectedWardId,
    setSelectedWardId,
    isAutoPlay,
    setIsAutoPlay,

    // Live telemetry (with jitter)
    liveRainfall,
    liveSoil,
    liveStream,
    setRainfallOverride,

    // Scenario setter
    setScenario,

    // Derived risk data
    riskResult,              // { total, breakdown, pct, state }
    wardRisk,                // score for currently selected ward
    ward,                    // full ward object

    // Micro-trend
    microTrend,

    // Infrastructure
    unsafeInfra,
    safeRoute,
    shelter,

    // POI actions
    poiActions,              // { evacuate: [], notify: [] }

    // Alert feed
    alertFeed,               // array of feed entries for current scenario

    // Convenience flags
    isWarningOrAbove: scenarioKey === 'WARNING' || scenarioKey === 'CRITICAL',
    isCritical:       scenarioKey === 'CRITICAL',
    bridgeClosed:     scenarioKey === 'WARNING' || scenarioKey === 'CRITICAL',
    showSafeRoute:    scenarioKey === 'WARNING' || scenarioKey === 'CRITICAL',
    showAlert:        scenarioKey === 'WARNING' || scenarioKey === 'CRITICAL',
  };
}
