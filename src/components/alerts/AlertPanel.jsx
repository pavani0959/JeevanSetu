import { useState } from 'react';

/**
 * AlertPanel — English / Hindi alert card
 * Slides in at WARNING+, screen flash on CRITICAL
 * Toggle: हिंदी में देखें / View in English
 */

const ALERTS = {
  NORMAL:   null,
  WATCH:    null,
  WARNING: {
    en: {
      title:    'WARNING ALERT — Ward 4',
      body:     `Heavy rainfall and rising stream levels are approaching dangerous thresholds.\nExercise caution. Do not use East Bridge.\nVolunteers are on standby. Shelter is being prepared at Hilltop Community School.`,
      action:   'Prepare for possible evacuation via North Road.',
    },
    hi: {
      title:    'चेतावनी — वार्ड 4',
      body:     `तेज बारिश और बढ़ते जलस्तर के कारण खतरनाक स्थिति उत्पन्न हो रही है।\nईस्ट ब्रिज का उपयोग न करें।\nस्वयंसेवक तैयार हैं। हिलटॉप कम्युनिटी स्कूल में शेल्टर तैयार किया जा रहा है।`,
      action:   'नॉर्थ रोड के माध्यम से निकासी के लिए तैयार रहें।',
    },
  },
  CRITICAL: {
    en: {
      title:    'CRITICAL ALERT — Ward 4',
      body:     `Heavy rainfall and rising stream levels indicate immediate flash-flood danger.\nDo not use East Bridge.\nMove through the marked safe route to Hilltop Community School Shelter.`,
      action:   'EVACUATE NOW via North Road. ETA ~18 minutes.',
    },
    hi: {
      title:    'तत्काल चेतावनी — वार्ड 4',
      body:     `तेज बारिश और बढ़ते जलस्तर के कारण अचानक बाढ़ का गंभीर खतरा है।\nईस्ट ब्रिज का उपयोग न करें।\nचिह्नित सुरक्षित मार्ग से हिलटॉप कम्युनिटी स्कूल शेल्टर की ओर जाएँ।`,
      action:   'अभी नॉर्थ रोड से निकासी करें। अनुमानित समय ~18 मिनट।',
    },
  },
};

export default function AlertPanel({ scenarioKey }) {
  const [lang, setLang] = useState('en');
  const alert = ALERTS[scenarioKey];
  const isCritical = scenarioKey === 'CRITICAL';
  const isWarning  = scenarioKey === 'WARNING';

  // No alert for NORMAL / WATCH
  if (!alert) {
    return (
      <div style={{
        padding: '12px',
        borderRadius: '8px',
        background: scenarioKey === 'WATCH' ? 'rgba(234,179,8,0.06)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${scenarioKey === 'WATCH' ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.05)'}`,
        fontSize: '12px',
        color: scenarioKey === 'WATCH' ? '#eab308' : 'var(--color-muted)',
      }}>
        {scenarioKey === 'WATCH'
          ? '🟡 Advisory: Conditions are rising. No evacuation required yet. Stay informed.'
          : '🟢 No active alert. Conditions normal.'}
      </div>
    );
  }

  const content = alert[lang];
  const borderColor = isCritical ? '#ef4444' : '#f97316';
  const bgColor     = isCritical ? 'rgba(239,68,68,0.08)' : 'rgba(249,115,22,0.07)';
  const titleColor  = isCritical ? '#ef4444' : '#f97316';

  return (
    <div
      className="animate-slide-down"
      style={{
        borderRadius: '10px',
        border: `1.5px solid ${borderColor}55`,
        background: bgColor,
        overflow: 'hidden',
        animation: isCritical ? 'criticalFlash 3s ease-in-out' : 'slideDown 0.4s ease',
        boxShadow: isCritical ? `0 0 24px ${borderColor}33` : 'none',
        transition: 'all 0.4s',
      }}
    >
      {/* Alert header */}
      <div style={{
        background: `${borderColor}22`,
        borderBottom: `1px solid ${borderColor}33`,
        padding: '10px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', background: borderColor,
            boxShadow: `0 0 8px ${borderColor}`,
            animation: 'glow-pulse 1.5s ease-in-out infinite', flexShrink: 0,
          }} />
          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            color: titleColor,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontFamily: lang === 'hi' ? "'Noto Sans Devanagari', sans-serif" : 'Inter, sans-serif',
          }}>
            {content.title}
          </span>
        </div>

        {/* Language toggle */}
        <button
          onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
          style={{
            padding: '3px 10px',
            borderRadius: '6px',
            border: `1px solid ${borderColor}44`,
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--color-muted-bright)',
            fontSize: '10px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          {lang === 'en' ? 'हिंदी में देखें' : 'View in English'}
        </button>
      </div>

      {/* Alert body */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{
          fontSize: '12px',
          color: 'var(--color-text-dim)',
          lineHeight: 1.7,
          margin: 0,
          whiteSpace: 'pre-line',
          fontFamily: lang === 'hi' ? "'Noto Sans Devanagari', sans-serif" : 'Inter, sans-serif',
        }}>
          {content.body}
        </p>

        {/* Action prompt */}
        <div style={{
          padding: '8px 10px',
          borderRadius: '7px',
          background: `${borderColor}18`,
          border: `1px solid ${borderColor}33`,
          fontSize: '12px',
          fontWeight: 700,
          color: titleColor,
          fontFamily: lang === 'hi' ? "'Noto Sans Devanagari', sans-serif" : 'Inter, sans-serif',
        }}>
          {content.action}
        </div>
      </div>

      {/* Flash animation styles */}
      <style>{`
        @keyframes criticalFlash {
          0%, 100% { box-shadow: 0 0 24px rgba(239,68,68,0.33); }
          10%, 30%, 50% { box-shadow: 0 0 40px rgba(239,68,68,0.7); }
          20%, 40%      { box-shadow: 0 0 24px rgba(239,68,68,0.33); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
