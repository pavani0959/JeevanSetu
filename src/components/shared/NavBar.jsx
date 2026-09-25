import Badge from '../shared/Badge';

/**
 * NavBar — top navigation bar
 * Shows: logo, tagline, current time, risk state badge
 * Props: riskState, currentTime
 */
export default function NavBar({ riskState = 'NORMAL', currentTime }) {
  return (
    <header
      id="main-navbar"
      style={{
        position: 'sticky',
        top: 30, /* clears the DEMO MODE banner height */
        zIndex: 100,
        width: '100%',
        background: 'rgba(7, 9, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '58px',
        gap: '16px',
      }}
    >
      {/* Logo + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            flexShrink: 0,
            boxShadow: '0 0 16px rgba(59,130,246,0.4)',
          }}
        >
          🌊
        </div>
        <div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #f1f5f9 0%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.1,
            }}
          >
            JeevanSetu
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-muted)', letterSpacing: '0.06em', marginTop: '1px' }}>
            Flash-Flood Early Warning &amp; Evacuation Support
          </div>
        </div>
      </div>

      {/* Centre — location */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-muted-bright)', fontSize: '13px' }}>
        <span style={{ fontSize: '14px' }}>📍</span>
        <span>Jeevanpur Valley, Hilly District</span>
        <span style={{ color: 'var(--color-border-bright)' }}>|</span>
        <span style={{ color: 'var(--color-muted)', fontSize: '12px' }}>Fictional Scenario</span>
      </div>

      {/* Right — time + risk state */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dim)', fontVariantNumeric: 'tabular-nums' }}>
            {currentTime}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-muted)', marginTop: '1px' }}>
            SIH26192
          </div>
        </div>
        <Badge status={riskState} size="md" />
      </div>
    </header>
  );
}
