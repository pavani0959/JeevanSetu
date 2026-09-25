/**
 * scenarios.js — Four scenario telemetry objects
 * Each represents a real-time snapshot of environmental conditions.
 * Values match exactly what is documented in the SIH26192 idea brief.
 */

export const SCENARIO_KEYS = ['NORMAL', 'WATCH', 'WARNING', 'CRITICAL'];

export const SCENARIOS = {
  NORMAL: {
    key:           'NORMAL',
    label:         'Normal',
    rainfall:      12,      // mm/hr
    soil:          48,      // % saturation
    stream:        1.1,     // metres above baseline
    wardRisk:      18,      // Ward 4 overall risk score (0-100)
    rainfallRisk:  8,       // contribution out of 40
    soilRisk:      5,       // contribution out of 25
    streamRisk:    3,       // contribution out of 20
    terrainRisk:   2,       // contribution out of 15
    description:   'Normal environmental conditions. Monitoring only.',
    action:        'Monitor',
    bridgeStatus:  'OPEN',
    routeStatus:   'ALL_CLEAR',
    shelterStatus: 'STANDBY',
    alertLevel:    'none',
    rainfallTrend: 'stable',
    soilTrend:     'stable',
    streamTrend:   'stable',
  },

  WATCH: {
    key:           'WATCH',
    label:         'Watch',
    rainfall:      42,
    soil:          65,
    stream:        1.8,
    wardRisk:      39,
    rainfallRisk:  18,
    soilRisk:      11,
    streamRisk:    7,
    terrainRisk:   3,
    description:   'Rain and saturation rising. Notify local volunteers and prepare.',
    action:        'Notify Volunteers',
    bridgeStatus:  'CAUTION',
    routeStatus:   'WATCH',
    shelterStatus: 'STANDBY',
    alertLevel:    'watch',
    rainfallTrend: 'rising',
    soilTrend:     'rising',
    streamTrend:   'rising',
  },

  WARNING: {
    key:           'WARNING',
    label:         'Warning',
    rainfall:      78,
    soil:          78,
    stream:        2.7,
    wardRisk:      64,
    rainfallRisk:  26,
    soilRisk:      18,
    streamRisk:    13,
    terrainRisk:   7,
    description:   'Local danger thresholds crossed. Open shelter and prepare evacuation.',
    action:        'Open Shelter',
    bridgeStatus:  'CLOSED',
    routeStatus:   'EVACUATE',
    shelterStatus: 'PREPARING',
    alertLevel:    'warning',
    rainfallTrend: 'rising_fast',
    soilTrend:     'rising',
    streamTrend:   'rising_fast',
  },

  CRITICAL: {
    key:           'CRITICAL',
    label:         'Critical',
    rainfall:      126,
    soil:          91,
    stream:        3.8,
    wardRisk:      84,
    rainfallRisk:  34,
    soilRisk:      22,
    streamRisk:    17,
    terrainRisk:   11,
    description:   'Immediate flash-flood danger. Evacuate now via marked safe route.',
    action:        'Evacuate NOW',
    bridgeStatus:  'CLOSED',
    routeStatus:   'EVACUATE',
    shelterStatus: 'OPEN',
    alertLevel:    'critical',
    rainfallTrend: 'rising_fast',
    soilTrend:     'rising_fast',
    streamTrend:   'rising_fast',
  },
};

/** Thresholds as per the plan */
export const RISK_THRESHOLDS = {
  NORMAL:   { min: 0,  max: 29 },
  WATCH:    { min: 30, max: 49 },
  WARNING:  { min: 50, max: 74 },
  CRITICAL: { min: 75, max: 100 },
};

/** Max contribution points per factor */
export const SCORE_MAX = {
  rainfall: 40,
  soil:     25,
  stream:   20,
  terrain:  15,
  total:    100,
};
