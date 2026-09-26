/**
 * OfflineBanner — shown when in offline/low-bandwidth mode
 * Props: visible (bool)
 */
export default function OfflineBanner({ visible }) {
  if (!visible) return null;

  return (
    <div
      id="offline-banner"
      className="animate-slide-down"
      style={{
        position: 'fixed',
        top: 74,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 20px',
        background: 'rgba(12, 16, 35, 0.94)',
        border: '1px solid rgba(96,165,250,0.4)',
        borderRadius: '9999px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        fontSize: '12px',
        fontWeight: 600,
        color: 'var(--color-rain)',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#60a5fa',
          boxShadow: '0 0 8px #60a5fa',
          animation: 'glow-pulse 1.5s infinite',
        }}
      />
      <span>
        <strong>Offline Operation Mode</strong>
        <span style={{ color: 'var(--color-muted-bright)', fontWeight: 400 }}>
          {' '}— using cached vector terrain map &amp; local telemetry cache
        </span>
      </span>
    </div>
  );
}
