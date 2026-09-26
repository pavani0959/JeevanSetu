export default function Footer({ currentTime }) {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(7, 10, 25, 0.95)',
        padding: '20px 24px',
        marginTop: '30px',
        color: 'var(--color-muted)',
        fontSize: '11px',
      }}
    >
      <div
        style={{
          maxWidth: '1920px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text)' }}>
            JeevanSetu — Flash-Flood Early Warning & Evacuation System
          </div>
          <div style={{ color: 'var(--color-muted-bright)' }}>
            High-Altitude Telemetry · AI Hydrological Risk Engine · Mesh Communication Infrastructure
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <span style={{ color: 'var(--color-muted)' }}>Engine Version: </span>
            <span style={{ fontWeight: 700, color: 'var(--color-text-dim)' }}>v2.4.0 Active</span>
          </div>
          <div>
            <span style={{ color: 'var(--color-muted)' }}>Confidence: </span>
            <span style={{ fontWeight: 700, color: '#22c55e' }}>98.4%</span>
          </div>
          <div>
            <span style={{ color: 'var(--color-muted)' }}>Last Sync: </span>
            <span style={{ fontWeight: 700, color: 'var(--color-text-dim)' }}>{currentTime || 'Real-time'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
