import { RISK_COLORS, RISK_BG_COLORS, RISK_BORDER_COLORS, RISK_EMOJIS } from '../../theme';

/**
 * Badge — coloured pill showing risk state
 * Props: status ('NORMAL'|'WATCH'|'WARNING'|'CRITICAL'), size ('sm'|'md'|'lg'), showDot
 */
export default function Badge({ status = 'NORMAL', size = 'md', showDot = true, label }) {
  const color  = RISK_COLORS[status]        || '#94a3b8';
  const bg     = RISK_BG_COLORS[status]     || 'rgba(148,163,184,0.1)';
  const border = RISK_BORDER_COLORS[status] || 'rgba(148,163,184,0.2)';
  const emoji  = RISK_EMOJIS[status]        || '⚪';
  const displayLabel = label || status;

  const sizeStyles = {
    sm: { fontSize: '10px', padding: '2px 8px', gap: '4px' },
    md: { fontSize: '12px', padding: '4px 10px', gap: '5px' },
    lg: { fontSize: '14px', padding: '5px 13px', gap: '6px' },
  };

  const dotSizes = { sm: 5, md: 6, lg: 8 };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizeStyles[size].gap,
        padding: sizeStyles[size].padding,
        fontSize: sizeStyles[size].fontSize,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: '9999px',
        whiteSpace: 'nowrap',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {showDot && (
        <span
          style={{
            width: dotSizes[size],
            height: dotSizes[size],
            borderRadius: '50%',
            background: color,
            flexShrink: 0,
            animation: status === 'CRITICAL' ? 'glow-pulse 1.5s ease-in-out infinite' : 'none',
            boxShadow: status === 'CRITICAL' ? `0 0 6px ${color}` : 'none',
          }}
        />
      )}
      {displayLabel}
    </span>
  );
}
