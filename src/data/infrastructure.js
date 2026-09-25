/**
 * infrastructure.js — Roads, bridges, shelters
 * Includes explicit shelter state per scenario as required by the implementation plan.
 */

/* ── BRIDGES ────────────────────────────────────────────────── */
export const BRIDGES = [
  {
    id:          'BR1',
    name:        'East Bridge',
    location:    'Connecting Ward 3 to Ward 4 across Jeevan Stream',
    ward:        'W3',
    isFloodProne: true,
    // Status per scenario
    statusByScenario: {
      NORMAL:   { status: 'OPEN',    label: 'Open — safe to use',         color: '#22c55e' },
      WATCH:    { status: 'CAUTION', label: 'Use caution — water rising',  color: '#eab308' },
      WARNING:  { status: 'CLOSED',  label: 'CLOSED — flood risk',         color: '#ef4444' },
      CRITICAL: { status: 'CLOSED',  label: 'CLOSED — flash flood danger', color: '#ef4444' },
    },
    // SVG coords for map marker
    svgX: 425, svgY: 295,
  },
];

/* ── ROADS ──────────────────────────────────────────────────── */
export const ROADS = [
  {
    id:        'RD1',
    name:      'South Road',
    direction: 'South exit from Ward 4',
    statusByScenario: {
      NORMAL:   { status: 'OPEN',    label: 'Open',               color: '#22c55e' },
      WATCH:    { status: 'CAUTION', label: 'USE CAUTION',        color: '#eab308' },
      WARNING:  { status: 'CAUTION', label: 'USE CAUTION',        color: '#f97316' },
      CRITICAL: { status: 'AVOID',   label: 'AVOID — prone to waterlogging', color: '#ef4444' },
    },
  },
  {
    id:        'RD2',
    name:      'North Road',
    direction: 'North exit from Ward 4 → Hilltop Ridge Road → Shelter',
    isSafeRoute: true,
    statusByScenario: {
      NORMAL:   { status: 'OPEN', label: 'Open', color: '#22c55e' },
      WATCH:    { status: 'OPEN', label: 'Open', color: '#22c55e' },
      WARNING:  { status: 'SAFE_ROUTE', label: '✅ SAFE EVACUATION ROUTE', color: '#22c55e' },
      CRITICAL: { status: 'SAFE_ROUTE', label: '✅ SAFE EVACUATION ROUTE', color: '#22c55e' },
    },
    // SVG path points for the safe route arrow on map
    svgPath: 'M460,330 L380,220 L220,120',
  },
];

/* ── SHELTERS ───────────────────────────────────────────────── */
export const SHELTERS = [
  {
    id:              'SH1',
    name:            'Hilltop Community School',
    fullName:        'Hilltop Community School Shelter',
    ward:            'W5',
    elevation:       980,            // metres — as per plan spec
    totalCapacity:   120,
    address:         'Hilltop Ridge, Ward 5, Jeevanpur Valley',
    contactMock:     'Local Response Coordinator: +91-XXXXX-XXXXX',
    distanceFromW4:  '4.2 km',
    etaMinutes:      18,
    // Explicit shelter state per scenario — wired as per plan requirement
    statusByScenario: {
      NORMAL: {
        status:           'STANDBY',
        label:            'Standby',
        color:            '#64748b',
        occupancy:         0,
        availableSpaces:  120,
        description:      'Shelter on standby. No action required.',
      },
      WATCH: {
        status:           'STANDBY',
        label:            'Standby — Volunteer Notified',
        color:            '#eab308',
        occupancy:         0,
        availableSpaces:  120,
        description:      'Volunteer notified. Shelter ready to activate.',
      },
      WARNING: {
        status:           'PREPARING',
        label:            'Preparing',
        color:            '#f97316',
        occupancy:         12,
        availableSpaces:  108,
        description:      'Shelter being prepared. Opening shortly.',
      },
      CRITICAL: {
        status:           'OPEN',
        label:            'OPEN & Active',
        color:            '#22c55e',
        occupancy:         33,
        availableSpaces:   87,
        description:      'Shelter open. 87 of 120 spaces available. Proceed immediately.',
      },
    },
    // SVG marker position on map
    svgX: 220, svgY: 70,
  },
];

/* ── SAFE EVACUATION ROUTE ─────────────────────────────────── */
export const SAFE_ROUTE = {
  id:       'RT1',
  name:     'North Road Evacuation Route',
  active:   ['WARNING', 'CRITICAL'],   // scenarios where route is shown
  steps: [
    { step: 1, instruction: 'Exit Ward 4 via North Road (avoid East Bridge)' },
    { step: 2, instruction: 'Continue along Hilltop Ridge Road (safe — elevated)' },
    { step: 3, instruction: 'Arrive at Hilltop Community School Shelter (Ward 5)' },
  ],
  distanceKm:  4.2,
  etaMinutes:  18,
  roadId:      'RD2',
  shelterId:   'SH1',
};

/* ── HELPERS ────────────────────────────────────────────────── */
export function getBridgeStatus(bridgeId, scenarioKey) {
  const bridge = BRIDGES.find(b => b.id === bridgeId);
  return bridge ? bridge.statusByScenario[scenarioKey] : null;
}

export function getShelterStatus(shelterId, scenarioKey) {
  const shelter = SHELTERS.find(s => s.id === shelterId);
  return shelter ? shelter.statusByScenario[scenarioKey] : null;
}

export function isRouteActive(scenarioKey) {
  return SAFE_ROUTE.active.includes(scenarioKey);
}

export function getUnsafeInfrastructure(scenarioKey) {
  const unsafe = [];
  BRIDGES.forEach(b => {
    const s = b.statusByScenario[scenarioKey];
    if (s.status === 'CLOSED' || s.status === 'CAUTION') {
      unsafe.push({ type: 'bridge', id: b.id, name: b.name, ...s });
    }
  });
  ROADS.forEach(r => {
    const s = r.statusByScenario[scenarioKey];
    if (s.status === 'CAUTION' || s.status === 'AVOID') {
      unsafe.push({ type: 'road', id: r.id, name: r.name, ...s });
    }
  });
  return unsafe;
}
