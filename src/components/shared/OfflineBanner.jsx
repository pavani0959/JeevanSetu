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
        top: 32,       /* sits just below the DEMO MODE banner */
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px 18px',
        background: 'rgba(12, 16, 35, 0.92)',
        border: '1px solid rgba(96,165,250,0.35)',
        borderRadius: '9999px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        fontSize: '12px',
        fontWeight: 500,
        color: 'var(--color-rain)',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: '14px' }}>📶</span>
      <span>
        <strong>Offline mode</strong>
        <span style={{ color: 'var(--color-muted-bright)', fontWeight: 400 }}>
          {' '}— using cached map &amp; last known data
        </span>
      </span>
    </div>
  );
}
