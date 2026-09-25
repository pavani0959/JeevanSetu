/**
 * wards.js — Ward definitions for Jeevanpur Valley (fictional)
 * 5 wards with elevation, vulnerability, population, and per-scenario risk scores.
 */

export const WARDS = [
  {
    id:                    'W1',
    name:                  'Upper Jeevanpur',
    shortName:             'Ward 1',
    description:           'Upstream high-elevation ward. Source of cloudburst runoff.',
    elevation:             1240,     // metres above sea level
    terrainVulnerability:  0.35,     // 0 = safe, 1 = most vulnerable
    population:            820,
    vulnerableCount: {
      elderly:   18,
      children:  24,
      pregnant:   2,
      mobility:   4,
      total:     48,
    },
    isSourceWard:   true,
    isEvacDest:     false,
    // SVG polygon centroid (approximate coords on the SVG canvas)
    svgCx:  160,
    svgCy:  110,
    // Risk score per scenario
    riskScores: { NORMAL: 8, WATCH: 22, WARNING: 38, CRITICAL: 54 },
  },
  {
    id:                    'W2',
    name:                  'Madhya Colony',
    shortName:             'Ward 2',
    description:           'Mid-slope residential ward. Moderate vulnerability.',
    elevation:             980,
    terrainVulnerability:  0.50,
    population:            1430,
    vulnerableCount: {
      elderly:   31,
      children:  42,
      pregnant:   5,
      mobility:   7,
      total:     85,
    },
    isSourceWard:   false,
    isEvacDest:     false,
    svgCx:  280,
    svgCy:  175,
    riskScores: { NORMAL: 12, WATCH: 30, WARNING: 51, CRITICAL: 68 },
  },
  {
    id:                    'W3',
    name:                  'Riverside Block',
    shortName:             'Ward 3',
    description:           'Stream-adjacent ward. High risk when stream level rises.',
    elevation:             760,
    terrainVulnerability:  0.72,
    population:            1860,
    vulnerableCount: {
      elderly:   44,
      children:  58,
      pregnant:   7,
      mobility:  10,
      total:    119,
    },
    isSourceWard:   false,
    isEvacDest:     false,
    svgCx:  380,
    svgCy:  255,
    riskScores: { NORMAL: 15, WATCH: 35, WARNING: 58, CRITICAL: 76 },
  },
  {
    id:                    'W4',
    name:                  'Nala Basin',
    shortName:             'Ward 4',
    description:           'Lowest elevation ward. Most vulnerable to flash floods. Primary evacuation target.',
    elevation:             620,
    terrainVulnerability:  0.92,
    population:            2240,
    vulnerableCount: {
      elderly:   52,
      children:  68,
      pregnant:   9,
      mobility:  13,
      total:    142,
    },
    isSourceWard:   false,
    isEvacDest:     false,
    isPrimaryRisk:  true,
    svgCx:  460,
    svgCy:  330,
    riskScores: { NORMAL: 18, WATCH: 39, WARNING: 64, CRITICAL: 84 },
  },
  {
    id:                    'W5',
    name:                  'Hilltop Ridge',
    shortName:             'Ward 5',
    description:           'Safe high-ground ward. Location of primary shelter. Evacuation destination.',
    elevation:             1380,
    terrainVulnerability:  0.10,
    population:            640,
    vulnerableCount: {
      elderly:   11,
      children:  15,
      pregnant:   1,
      mobility:   2,
      total:     29,
    },
    isSourceWard:   false,
    isEvacDest:     true,
    isSafeZone:     true,
    svgCx:  220,
    svgCy:  70,
    riskScores: { NORMAL: 4, WATCH: 10, WARNING: 18, CRITICAL: 26 },
  },
];

/** Helper: get ward by id */
export function getWardById(id) {
  return WARDS.find(w => w.id === id) || null;
}

/** Helper: get risk score for a specific ward + scenario */
export function getWardRiskScore(wardId, scenarioKey) {
  const ward = getWardById(wardId);
  return ward ? ward.riskScores[scenarioKey] : 0;
}

/** The primary at-risk ward (W4) */
export const PRIMARY_RISK_WARD_ID = 'W4';
