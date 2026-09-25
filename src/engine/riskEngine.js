/**
 * riskEngine.js — Transparent, rule-based Ward Risk Score calculator
 *
 * Formula (as per SIH26192 plan):
 *   Ward Risk Score (0–100) =
 *     Rainfall Risk         (max 40 pts)
 *   + Soil Saturation Risk  (max 25 pts)
 *   + Stream Level Risk     (max 20 pts)
 *   + Terrain Vulnerability (max 15 pts)
 *
 * This is intentionally NOT a black-box ML model.
 * Every score is explainable and traceable to its input.
 */

import { RISK_THRESHOLDS, SCORE_MAX } from '../data/scenarios';
import { SHELTERS, BRIDGES, ROADS, SAFE_ROUTE, getUnsafeInfrastructure } from '../data/infrastructure';

/* ── Individual factor calculators ─────────────────────────── */

/**
 * Rainfall risk score (0–40)
 * Thresholds based on IMD heavy rain categories:
 *   < 15 mm/hr  → Low
 *   15–35        → Moderate
 *   35–64        → Heavy
 *   64–115       → Very Heavy
 *   > 115        → Extremely Heavy (cloudburst territory)
 */
export function calculateRainfallRisk(mmPerHr) {
  if (mmPerHr <= 0)   return 0;
  if (mmPerHr < 15)   return Math.round((mmPerHr / 15) * 8);          //  0– 8
  if (mmPerHr < 35)   return Math.round(8  + ((mmPerHr - 15)  / 20) * 10); //  8–18
  if (mmPerHr < 64)   return Math.round(18 + ((mmPerHr - 35)  / 29) * 10); // 18–28
  if (mmPerHr < 115)  return Math.round(28 + ((mmPerHr - 64)  / 51) * 8);  // 28–36
  return Math.min(40,  Math.round(36 + ((mmPerHr - 115) / 50) * 4));       // 36–40
}

/**
 * Soil saturation risk score (0–25)
 * Saturated soil cannot absorb more water → runoff increases dramatically
 */
export function calculateSoilRisk(pct) {
  if (pct <= 0)   return 0;
  if (pct < 40)   return Math.round((pct / 40) * 5);           //  0– 5
  if (pct < 60)   return Math.round(5  + ((pct - 40)  / 20) * 7);  //  5–12
  if (pct < 75)   return Math.round(12 + ((pct - 60)  / 15) * 7);  // 12–19
  if (pct < 90)   return Math.round(19 + ((pct - 75)  / 15) * 4);  // 19–23
  return Math.min(25, Math.round(23 + ((pct - 90) / 10) * 2));      // 23–25
}

/**
 * Stream level risk score (0–20)
 * Rising stream = rising inundation risk for downstream wards
 */
export function calculateStreamRisk(metres) {
  if (metres <= 0)    return 0;
  if (metres < 1.0)   return Math.round((metres / 1.0)  * 3);         //  0– 3
  if (metres < 1.5)   return Math.round(3  + ((metres - 1.0) / 0.5)  * 4); //  3– 7
  if (metres < 2.5)   return Math.round(7  + ((metres - 1.5) / 1.0)  * 6); //  7–13
  if (metres < 3.5)   return Math.round(13 + ((metres - 2.5) / 1.0)  * 5); // 13–18
  return Math.min(20, Math.round(18 + ((metres - 3.5) / 1.0) * 2));        // 18–20
}

/**
 * Terrain vulnerability risk score (0–15)
 * Fixed per ward — based on elevation and slope
 * @param {number} vulnerabilityIndex  0.0 (safe) → 1.0 (most vulnerable)
 */
export function calculateTerrainRisk(vulnerabilityIndex) {
  return Math.min(15, Math.round(vulnerabilityIndex * 15));
}

/* ── Combined risk score ────────────────────────────────────── */

/**
 * Calculate full ward risk score with breakdown
 * @param {{ rainfall: number, soil: number, stream: number, terrainVulnerability: number }} inputs
 * @returns {{
 *   total: number,
 *   breakdown: { rainfall: number, soil: number, stream: number, terrain: number },
 *   state: string,
 *   pct: { rainfall: number, soil: number, stream: number, terrain: number }
 * }}
 */
export function calculateWardRiskScore({ rainfall, soil, stream, terrainVulnerability }) {
  const rainfallScore = calculateRainfallRisk(rainfall);
  const soilScore     = calculateSoilRisk(soil);
  const streamScore   = calculateStreamRisk(stream);
  const terrainScore  = calculateTerrainRisk(terrainVulnerability);

  const total = rainfallScore + soilScore + streamScore + terrainScore;

  return {
    total: Math.min(100, total),
    breakdown: {
      rainfall: rainfallScore,
      soil:     soilScore,
      stream:   streamScore,
      terrain:  terrainScore,
    },
    // Percentage of max for each factor (for progress bars)
    pct: {
      rainfall: Math.round((rainfallScore / SCORE_MAX.rainfall) * 100),
      soil:     Math.round((soilScore     / SCORE_MAX.soil)     * 100),
      stream:   Math.round((streamScore   / SCORE_MAX.stream)   * 100),
      terrain:  Math.round((terrainScore  / SCORE_MAX.terrain)  * 100),
    },
    state: getRiskState(total),
  };
}

/* ── Risk state classifier ──────────────────────────────────── */

/**
 * Classify a risk score into a named state
 * @param {number} score  0–100
 * @returns {'NORMAL'|'WATCH'|'WARNING'|'CRITICAL'}
 */
export function getRiskState(score) {
  if (score >= RISK_THRESHOLDS.CRITICAL.min) return 'CRITICAL';
  if (score >= RISK_THRESHOLDS.WARNING.min)  return 'WARNING';
  if (score >= RISK_THRESHOLDS.WATCH.min)    return 'WATCH';
  return 'NORMAL';
}

/* ── Infrastructure helpers ─────────────────────────────────── */

export { getUnsafeInfrastructure };

/**
 * Get the recommended safe route (active only at WARNING+)
 * @param {string} scenarioKey
 */
export function getSafeRoute(scenarioKey) {
  if (!SAFE_ROUTE.active.includes(scenarioKey)) return null;
  return SAFE_ROUTE;
}

/**
 * Get active shelter status for the primary shelter
 * @param {string} scenarioKey
 */
export function getActiveShelter(scenarioKey) {
  const shelter = SHELTERS[0]; // Hilltop Community School
  return {
    ...shelter,
    currentStatus: shelter.statusByScenario[scenarioKey],
  };
}

/* ── Self-test (can be called from browser console) ────────── */
export function runSelfTest() {
  const tests = [
    { label: 'NORMAL  (12mm, 48%, 1.1m, 0.92)', inputs: { rainfall: 12,  soil: 48, stream: 1.1, terrainVulnerability: 0.92 }, expectedState: 'NORMAL'   },
    { label: 'WATCH   (42mm, 65%, 1.8m, 0.92)', inputs: { rainfall: 42,  soil: 65, stream: 1.8, terrainVulnerability: 0.92 }, expectedState: 'WATCH'    },
    { label: 'WARNING (78mm, 78%, 2.7m, 0.92)', inputs: { rainfall: 78,  soil: 78, stream: 2.7, terrainVulnerability: 0.92 }, expectedState: 'WARNING'  },
    { label: 'CRITICAL(126mm,91%, 3.8m, 0.92)', inputs: { rainfall: 126, soil: 91, stream: 3.8, terrainVulnerability: 0.92 }, expectedState: 'CRITICAL' },
  ];

  console.group('🌊 JeevanSetu Risk Engine Self-Test');
  tests.forEach(t => {
    const result = calculateWardRiskScore(t.inputs);
    const pass = result.state === t.expectedState;
    console.log(
      `${pass ? '✅' : '❌'} ${t.label}`,
      `→ Score: ${result.total}/100`,
      `→ State: ${result.state}`,
      `(expected: ${t.expectedState})`,
      '\n   Breakdown:', result.breakdown
    );
  });
  console.groupEnd();
}
