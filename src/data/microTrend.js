/**
 * microTrend.js — Last 30 minutes history arrays per scenario
 * Each array has 4 data points = 4 × ~8 minute intervals = ~30 minutes
 * Values represent the progression leading UP TO the current scenario state.
 *
 * Used by MicroTrendPanel (Phase 3) to render sparklines.
 */

export const MICRO_TREND = {
  NORMAL: {
    timestamps:  ['22:00', '22:08', '22:16', '22:24'],
    rainfall:    [8,   10,  11,  12],     // mm/hr — stable low
    soil:        [44,  45,  47,  48],     // % — stable
    stream:      [0.9, 1.0, 1.0, 1.1],   // metres — stable
    direction: {
      rainfall: 'stable',
      soil:     'stable',
      stream:   'stable',
    },
    directionLabel: {
      rainfall: '→ Stable',
      soil:     '→ Stable',
      stream:   '→ Stable',
    },
  },

  WATCH: {
    timestamps:  ['22:00', '22:08', '22:16', '22:24'],
    rainfall:    [12,  24,  38,  42],     // mm/hr — rising
    soil:        [48,  54,  60,  65],     // % — rising
    stream:      [1.1, 1.3, 1.6, 1.8],   // metres — rising
    direction: {
      rainfall: 'rising',
      soil:     'rising',
      stream:   'rising',
    },
    directionLabel: {
      rainfall: '↑ Rising',
      soil:     '↑ Rising',
      stream:   '↑ Rising',
    },
  },

  WARNING: {
    timestamps:  ['22:00', '22:08', '22:16', '22:24'],
    rainfall:    [42,  55,  68,  78],     // mm/hr — rising fast
    soil:        [65,  70,  74,  78],     // % — rising
    stream:      [1.8, 2.1, 2.4, 2.7],   // metres — rising fast
    direction: {
      rainfall: 'rising_fast',
      soil:     'rising',
      stream:   'rising_fast',
    },
    directionLabel: {
      rainfall: '↑↑ Rapidly Rising',
      soil:     '↑ Rising',
      stream:   '↑↑ Rapidly Rising',
    },
  },

  CRITICAL: {
    timestamps:  ['22:00', '22:08', '22:16', '22:24'],
    rainfall:    [78,  95,  112, 126],    // mm/hr — rapidly rising
    soil:        [78,  83,  87,  91],     // % — rapidly rising
    stream:      [2.7, 3.1, 3.5, 3.8],   // metres — rapidly rising
    direction: {
      rainfall: 'rising_fast',
      soil:     'rising_fast',
      stream:   'rising_fast',
    },
    directionLabel: {
      rainfall: '↑↑ Rapidly Rising',
      soil:     '↑↑ Rapidly Rising',
      stream:   '↑↑ Rapidly Rising',
    },
  },
};

/**
 * Get direction arrow symbol for a trend
 * @param {'stable'|'rising'|'rising_fast'} trend
 */
export function getTrendArrow(trend) {
  switch (trend) {
    case 'rising_fast': return '↑↑';
    case 'rising':      return '↑';
    case 'stable':
    default:            return '→';
  }
}

/**
 * Get colour for a trend direction
 */
export function getTrendColor(trend) {
  switch (trend) {
    case 'rising_fast': return '#ef4444';
    case 'rising':      return '#f97316';
    case 'stable':
    default:            return '#22c55e';
  }
}
