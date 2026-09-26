import Badge from '../shared/Badge';

/**
 * NavBar — top navigation bar
 * Props: riskState, currentTime, isHindi, setIsHindi
 */
export default function NavBar({ riskState = 'NORMAL', currentTime, isHindi, setIsHindi }) {
  return (
    <header
      id="main-navbar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        background: 'rgba(7, 10, 25, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '62px',
        gap: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* Title & Brand Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '20px',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(90deg, #ffffff 0%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.1,
              }}
            >
              JeevanSetu
            </span>
            <span
              style={{
                fontSize: '9px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '2px 7px',
                borderRadius: '4px',
                background: 'rgba(59,130,246,0.18)',
                color: '#60a5fa',
                border: '1px solid rgba(59,130,246,0.3)',
              }}
            >
              {isHindi ? 'जीवनसेतु चेतावनी प्रणाली' : 'EARLY WARNING SYSTEM'}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-muted-bright)', letterSpacing: '0.02em', marginTop: '2px' }}>
            {isHindi ? 'अचानक बाढ़ पूर्व चेतावनी और बचाव नियंत्रण' : 'Flash-Flood Early Warning & Evacuation Support Command'}
          </div>
        </div>
      </div>

      {/* Centre — location & catchment info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--color-muted-bright)',
          fontSize: '13px',
          background: 'rgba(255,255,255,0.03)',
          padding: '6px 14px',
          borderRadius: '9999px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 8px #22c55e',
            animation: 'glow-pulse 1.8s ease-in-out infinite',
            flexShrink: 0,
          }}
        />
        <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>
          {isHindi ? 'जीवनपुर घाटी (Jeevanpur Valley)' : 'Jeevanpur Catchment Basin'}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <span style={{ color: 'var(--color-muted)', fontSize: '12px' }}>
          {isHindi ? 'सेक्टर 4 स्टेशन' : 'Sector 4 High-Altitude Station'}
        </span>
      </div>

      {/* Right — Language switch + time + risk state */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Prominent Language Switcher */}
        <button
          onClick={() => setIsHindi(!isHindi)}
          style={{
            padding: '5px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(96,165,250,0.4)',
            background: isHindi ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.05)',
            color: isHindi ? '#60a5fa' : 'var(--color-text)',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{
            fontSize: '9px', padding: '1px 4px', borderRadius: '3px',
            background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 800,
          }}>
            {isHindi ? 'HI' : 'EN'}
          </span>
          <span>{isHindi ? 'English' : 'हिंदी (Hindi)'}</span>
        </button>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', fontVariantNumeric: 'tabular-nums' }}>
            {currentTime}
          </div>
          <div style={{ fontSize: '10px', color: '#22c55e', marginTop: '1px', fontWeight: 600 }}>
            {isHindi ? 'लाइव डेटा सक्रिय' : 'REAL-TIME TELEMETRY'}
          </div>
        </div>
        <Badge status={riskState} size="md" />
      </div>
    </header>
  );
}
