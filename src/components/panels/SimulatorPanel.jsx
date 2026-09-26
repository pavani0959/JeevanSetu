import { useEffect, useRef, useState } from 'react';

const SCENARIOS = [
  { key: 'NORMAL',   labelEn: 'NORMAL',   labelHi: 'सामान्य (Normal)',      sub: '12 mm/hr', color: '#22c55e' },
  { key: 'WATCH',    labelEn: 'WATCH',    labelHi: 'सतर्कता (Watch)',       sub: '42 mm/hr', color: '#eab308' },
  { key: 'WARNING',  labelEn: 'WARNING',  labelHi: 'चेतावनी (Warning)',     sub: '78 mm/hr', color: '#f97316' },
  { key: 'CRITICAL', labelEn: 'CLOUDBURST', labelHi: 'खतरा (Cloudburst)',   sub: '126 mm/hr', color: '#ef4444' },
];

export default function SimulatorPanel({
  scenarioKey,
  setScenario,
  isAutoPlay,
  setIsAutoPlay,
  rainfallOverride,
  setRainfallOverride,
  isOffline,
  toggleDemoOffline,
  isHindi,
}) {
  const autoRef = useRef(null);
  const [sliderVal, setSliderVal] = useState(rainfallOverride ?? 12);
  const [showSlider, setShowSlider] = useState(false);

  useEffect(() => {
    if (!isAutoPlay) {
      if (autoRef.current) clearInterval(autoRef.current);
      return;
    }
    const keys = ['NORMAL', 'WATCH', 'WARNING', 'CRITICAL'];
    let idx = keys.indexOf(scenarioKey);
    autoRef.current = setInterval(() => {
      idx = (idx + 1) % keys.length;
      setScenario(keys[idx]);
    }, 3500);
    return () => clearInterval(autoRef.current);
  }, [isAutoPlay, scenarioKey, setScenario]);

  const handleSlider = (e) => {
    const val = Number(e.target.value);
    setSliderVal(val);
    setRainfallOverride(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Section label */}
      <div style={{ fontSize: '10px', color: 'var(--color-muted-bright)', fontWeight: 700, letterSpacing: '0.04em' }}>
        {isHindi ? 'मौसम एवं परिस्थिति नियंत्रण' : 'Simulate Flood Conditions'}
      </div>

      {/* 4 scenario buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {SCENARIOS.map(s => {
          const isActive = scenarioKey === s.key;
          return (
            <button
              key={s.key}
              id={`scenario-btn-${s.key.toLowerCase()}`}
              onClick={() => { setIsAutoPlay(false); setScenario(s.key); }}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: `1.5px solid ${isActive ? s.color : 'var(--color-border)'}`,
                background: isActive
                  ? `linear-gradient(135deg, ${s.color}22, ${s.color}0a)`
                  : 'rgba(255,255,255,0.02)',
                color: isActive ? s.color : 'var(--color-muted-bright)',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.25s ease',
                boxShadow: isActive
                  ? `0 0 16px ${s.color}35, inset 0 0 12px ${s.color}08`
                  : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: s.color,
                  boxShadow: isActive ? `0 0 8px ${s.color}` : 'none',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span>{isHindi ? s.labelHi : s.labelEn}</span>
                  <span style={{ fontSize: '11px', fontWeight: 500, opacity: 0.8 }}>{s.sub}</span>
                </div>
                {isActive && (
                  <div style={{
                    height: '2px',
                    background: `linear-gradient(90deg, ${s.color}, transparent)`,
                    borderRadius: '1px',
                    marginTop: '4px',
                    animation: 'shimmer 2s ease-in-out infinite',
                  }} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Auto-play toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 10px',
        borderRadius: '8px',
        background: isAutoPlay ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isAutoPlay ? 'rgba(59,130,246,0.25)' : 'var(--color-border)'}`,
        transition: 'all 0.3s',
      }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: isAutoPlay ? '#60a5fa' : 'var(--color-muted-bright)' }}>
            {isHindi ? 'स्वचालित बदलाव (Auto Cycle)' : 'Auto-Play Cycle'}
          </div>
          <div style={{ fontSize: '9px', color: 'var(--color-muted)', marginTop: '1px' }}>
            {isHindi ? 'हर 3.5 सेकंड में अपने आप बदलेगा' : 'Cycles every 3.5s automatically'}
          </div>
        </div>
        <button
          id="autoplay-toggle"
          onClick={() => setIsAutoPlay(v => !v)}
          style={{
            padding: '5px 14px',
            borderRadius: '6px',
            border: `1px solid ${isAutoPlay ? '#60a5fa' : 'var(--color-border)'}`,
            background: isAutoPlay ? 'rgba(59,130,246,0.2)' : 'transparent',
            color: isAutoPlay ? '#60a5fa' : 'var(--color-muted)',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.2s',
          }}
        >
          {isAutoPlay ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Rainfall Slider */}
      <div style={{
        padding: '8px 10px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-muted-bright)' }}>
              {isHindi ? 'बारिश की मात्रा (Rainfall Slider)' : 'Rainfall Control'}
            </div>
            <div style={{ fontSize: '9px', color: 'var(--color-muted)' }}>12–150 mm/hr</div>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{
              fontSize: '16px', fontWeight: 900,
              color: sliderVal >= 115 ? '#ef4444' : sliderVal >= 64 ? '#f97316' : sliderVal >= 32 ? '#eab308' : '#22c55e',
              fontVariantNumeric: 'tabular-nums',
              transition: 'color 0.3s',
            }}>
              {sliderVal}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--color-muted)' }}>mm/hr</span>
            {showSlider ? (
              <button onClick={() => { setShowSlider(false); setRainfallOverride(null); }}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}>✕</button>
            ) : (
              <button onClick={() => setShowSlider(true)}
                style={{ background: 'none', border: `1px solid var(--color-border)`, color: 'var(--color-muted)', cursor: 'pointer', fontSize: '10px', padding: '2px 7px', borderRadius: '4px', fontFamily: 'Inter' }}>
                {isHindi ? 'बदलें' : 'Edit'}
              </button>
            )}
          </div>
        </div>

        {showSlider && (
          <input
            id="rainfall-slider"
            type="range"
            min={12} max={150} step={1}
            value={sliderVal}
            onChange={handleSlider}
            style={{
              width: '100%',
              appearance: 'none',
              height: '4px',
              borderRadius: '2px',
              background: `linear-gradient(90deg, #22c55e ${((sliderVal-12)/138)*100}%, rgba(255,255,255,0.08) ${((sliderVal-12)/138)*100}%)`,
              outline: 'none',
              cursor: 'pointer',
            }}
          />
        )}
      </div>

      {/* Offline toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 10px',
        borderRadius: '8px',
        background: isOffline ? 'rgba(96,165,250,0.06)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isOffline ? 'rgba(96,165,250,0.2)' : 'var(--color-border)'}`,
        transition: 'all 0.3s',
      }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: isOffline ? '#60a5fa' : 'var(--color-muted-bright)' }}>
            {isHindi ? 'ऑफ़लाइन मोड (Offline Mode)' : 'Offline Operation Mode'}
          </div>
          <div style={{ fontSize: '9px', color: 'var(--color-muted)', marginTop: '1px' }}>
            {isHindi ? 'लोकल कैश मैप का उपयोग' : 'Cached vector map enabled'}
          </div>
        </div>
        <button
          id="offline-toggle"
          onClick={toggleDemoOffline}
          style={{
            padding: '5px 14px',
            borderRadius: '6px',
            border: `1px solid ${isOffline ? '#60a5fa' : 'var(--color-border)'}`,
            background: isOffline ? 'rgba(96,165,250,0.15)' : 'transparent',
            color: isOffline ? '#60a5fa' : 'var(--color-muted)',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.2s',
          }}
        >
          {isOffline ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
}
