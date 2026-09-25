/**
 * vulnerablePOI.js — Schools, health centres, anganwadi centres
 * These are special locations requiring priority evacuation.
 * As specified in the SIH26192 idea doc (Section 7 — Human-first angle).
 */

export const VULNERABLE_POIS = [
  {
    id:                 'POI1',
    name:               'Jeevanpur Primary School',
    shortName:          'Primary School',
    type:               'school',           // 'school' | 'health' | 'anganwadi'
    emoji:              '🏫',
    ward:               'W3',               // Riverside Block
    elevation:          755,
    estimatedOccupants: 340,                // students + staff during school hours
    priority:           'HIGH',             // 'HIGH' | 'MODERATE'
    evacuateFirstAt:    ['WARNING', 'CRITICAL'],
    actionLabel:        'EVACUATE FIRST',
    notifyAt:           ['WATCH'],
    contactMock:        'School Principal (mocked)',
    // SVG marker position
    svgX: 360,
    svgY: 240,
  },
  {
    id:                 'POI2',
    name:               'Nala Basin Health Sub-Centre',
    shortName:          'Health Sub-Centre',
    type:               'health',
    emoji:              '🏥',
    ward:               'W4',               // Nala Basin — most vulnerable ward
    elevation:          618,
    estimatedOccupants: 45,                 // patients + staff
    priority:           'HIGH',
    evacuateFirstAt:    ['WARNING', 'CRITICAL'],
    actionLabel:        'EVACUATE FIRST',
    notifyAt:           ['WATCH'],
    contactMock:        'Health Sub-Centre In-charge (mocked)',
    svgX: 475,
    svgY: 345,
  },
  {
    id:                 'POI3',
    name:               'Anganwadi Centre',
    shortName:          'Anganwadi',
    type:               'anganwadi',
    emoji:              '🏠',
    ward:               'W2',               // Madhya Colony
    elevation:          976,
    estimatedOccupants: 28,                 // young children + workers
    priority:           'MODERATE',
    evacuateFirstAt:    ['CRITICAL'],
    actionLabel:        'NOTIFY',
    notifyAt:           ['WATCH', 'WARNING'],
    contactMock:        'Anganwadi Worker (mocked)',
    svgX: 270,
    svgY: 185,
  },
];

/**
 * Get POIs that need action at the given scenario
 * @param {string} scenarioKey
 * @returns {{ evacuate: POI[], notify: POI[] }}
 */
export function getPOIActions(scenarioKey) {
  return {
    evacuate: VULNERABLE_POIS.filter(p => p.evacuateFirstAt.includes(scenarioKey)),
    notify:   VULNERABLE_POIS.filter(p =>
      p.notifyAt.includes(scenarioKey) && !p.evacuateFirstAt.includes(scenarioKey)
    ),
  };
}

/** Get all POIs in a specific ward */
export function getPOIsByWard(wardId) {
  return VULNERABLE_POIS.filter(p => p.ward === wardId);
}
