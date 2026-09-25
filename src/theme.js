// JeevanSetu — Theme Tokens (JS mirror of CSS variables)
// Use these in JS/JSX wherever you need colours programmatically

export const COLORS = {
  bg:           '#07091a',
  bg2:          '#0c1023',
  surface:      '#111827',
  border:       '#1f2937',
  borderBright: '#2d3748',

  // Risk states
  normal:       '#22c55e',
  normalDim:    '#166534',
  watch:        '#eab308',
  watchDim:     '#854d0e',
  warning:      '#f97316',
  warningDim:   '#9a3412',
  critical:     '#ef4444',
  criticalDim:  '#991b1b',

  // UI
  accent:       '#3b82f6',
  rain:         '#60a5fa',
  soil:         '#a78bfa',
  stream:       '#34d399',

  // Text
  text:         '#f1f5f9',
  textDim:      '#cbd5e1',
  muted:        '#64748b',
  mutedBright:  '#94a3b8',
};

export const RISK_COLORS = {
  NORMAL:   COLORS.normal,
  WATCH:    COLORS.watch,
  WARNING:  COLORS.warning,
  CRITICAL: COLORS.critical,
};

export const RISK_BG_COLORS = {
  NORMAL:   'rgba(34,197,94,0.12)',
  WATCH:    'rgba(234,179,8,0.12)',
  WARNING:  'rgba(249,115,22,0.12)',
  CRITICAL: 'rgba(239,68,68,0.12)',
};

export const RISK_BORDER_COLORS = {
  NORMAL:   'rgba(34,197,94,0.3)',
  WATCH:    'rgba(234,179,8,0.3)',
  WARNING:  'rgba(249,115,22,0.3)',
  CRITICAL: 'rgba(239,68,68,0.35)',
};

export const RISK_GLOW = {
  NORMAL:   '0 0 20px rgba(34,197,94,0.25)',
  WATCH:    '0 0 20px rgba(234,179,8,0.25)',
  WARNING:  '0 0 20px rgba(249,115,22,0.3)',
  CRITICAL: '0 0 28px rgba(239,68,68,0.45)',
};

export const RISK_LABELS = {
  NORMAL:   'NORMAL',
  WATCH:    'WATCH',
  WARNING:  'WARNING',
  CRITICAL: 'CRITICAL',
};

export const RISK_EMOJIS = {
  NORMAL:   '🟢',
  WATCH:    '🟡',
  WARNING:  '🟠',
  CRITICAL: '🔴',
};

export const CHART_COLORS = {
  rainfall: COLORS.rain,
  soil:     COLORS.soil,
  stream:   COLORS.stream,
};
