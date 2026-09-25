/**
 * DemoModeBanner — persistent top banner indicating this is a demo
 * Always visible at the top of the screen
 */
export default function DemoModeBanner() {
  return (
    <div
      id="demo-mode-banner"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'linear-gradient(90deg, rgba(239,68,68,0.15) 0%, rgba(249,115,22,0.12) 50%, rgba(239,68,68,0.15) 100%)',
        borderBottom: '1px solid rgba(239,68,68,0.3)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '6px 16px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.85)',
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: '#ef4444',
          boxShadow: '0 0 8px #ef4444',
          animation: 'glow-pulse 1.5s ease-in-out infinite',
          flexShrink: 0,
        }}
      />
      🔴 DEMO MODE — Simulated Cloudburst Scenario
      <span style={{ color: 'var(--color-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
        &nbsp;|&nbsp; All data is dummy/simulated &nbsp;|&nbsp; Jeevanpur Valley (Fictional)
      </span>
    </div>
  );
}
