const STATUS_GUIDE = {
  NORMAL: {
    badge: 'ALL SAFE',
    badgeHi: 'सब सुरक्षित',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.3)',
    titleHi: 'गांव में सब सामान्य है · कोई खतरा नहीं',
    titleEn: 'Conditions are normal across Jeevanpur Valley',
    doHi: 'सामान्य दैनिक कार्य जारी रखें। किसी आपात स्थिति की संभावना नहीं है।',
    doEn: 'Normal activities can continue. No flood threat present.',
    shelterStatusHi: 'शेल्टर (स्कूल) बंद - आवश्यकता नहीं',
    shelterStatusEn: 'Shelter closed — not required',
    bridgeStatusHi: 'ईस्ट ब्रिज (East Bridge) खुला है',
    bridgeStatusEn: 'East Bridge is OPEN and safe',
  },
  WATCH: {
    badge: 'STAY WATCHFUL',
    badgeHi: 'सतर्क रहें',
    color: '#eab308',
    bg: 'rgba(234,179,8,0.08)',
    border: 'rgba(234,179,8,0.3)',
    titleHi: 'तेज बारिश की संभावना · तैयारी रखें',
    titleEn: 'Heavy rain expected on upper hills',
    doHi: 'मोबाइल फोन, टॉर्च और जरूरी दवाइयां पास रखें। बच्चों का ध्यान रखें।',
    doEn: 'Keep mobile phone charged, emergency light and medicine ready.',
    shelterStatusHi: 'हिलटॉप स्कूल शेल्टर तैयार रखा जा रहा है',
    shelterStatusEn: 'Hilltop School Shelter is on standby',
    bridgeStatusHi: 'ईस्ट ब्रिज से सावधानी से निकलें',
    bridgeStatusEn: 'Exercise caution at East Bridge',
  },
  WARNING: {
    badge: 'WARNING',
    badgeHi: 'सावधान रहें',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
    border: 'rgba(249,115,22,0.4)',
    titleHi: 'नाले और नदी का पानी तेजी से बढ़ रहा है!',
    titleEn: 'Stream water rising rapidly near Ward 4!',
    doHi: 'निचले इलाके से दूर रहें। नाले या ईस्ट ब्रिज के पास न जाएँ!',
    doEn: 'Move away from low-lying stream banks. DO NOT use East Bridge!',
    shelterStatusHi: 'हिलटॉप स्कूल शेल्टर खुल गया है (सुरक्षित जगह)',
    shelterStatusEn: 'Hilltop School Shelter is OPEN & ready',
    bridgeStatusHi: 'ईस्ट ब्रिज (East Bridge) बंद कर दिया गया है',
    bridgeStatusEn: 'East Bridge is CLOSED for safety',
  },
  CRITICAL: {
    badge: 'EVACUATE NOW',
    badgeHi: 'खतरा! तुरंत जगह खाली करें',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.5)',
    titleHi: 'अचानक बाढ़ (Cloudburst) का बहुत तेज खतरा!',
    titleEn: 'Flash flood imminent! Immediate evacuation required!',
    doHi: 'तुरंत उत्तरी मार्ग (North Road) से हिलटॉप स्कूल शेल्टर जाएँ!',
    doEn: 'EVACUATE IMMEDIATELY via North Road to Hilltop School Shelter!',
    shelterStatusHi: 'हिलटॉप स्कूल शेल्टर पहुँचें — (भोजन व प्राथमिक चिकित्सा उपलब्ध)',
    shelterStatusEn: 'Go to Hilltop School Shelter (Food & Medical ready)',
    bridgeStatusHi: 'ईस्ट ब्रिज पानी में डूब सकता है — कभी न जाएँ!',
    bridgeStatusEn: 'East Bridge flooded — AVOID AT ALL COSTS!',
  },
};

export default function VillageQuickGuide({ scenarioKey, isHindi }) {
  const current = STATUS_GUIDE[scenarioKey] || STATUS_GUIDE.NORMAL;

  return (
    <div
      style={{
        borderRadius: '12px',
        background: current.bg,
        border: `1.5px solid ${current.border}`,
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: `0 4px 24px ${current.color}15`,
        transition: 'all 0.4s ease',
      }}
    >
      {/* Banner Top Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              background: current.color,
              color: '#0a0f1e',
              fontWeight: 900,
              fontSize: '12px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {isHindi ? current.badgeHi : current.badge}
          </span>
          <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text)' }}>
            {isHindi ? current.titleHi : current.titleEn}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a
            href="tel:1077"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 16px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '12px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(239,68,68,0.35)',
              letterSpacing: '0.02em',
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#fff',
              boxShadow: '0 0 6px #fff', animation: 'glow-pulse 1.5s infinite',
            }} />
            {isHindi ? 'आपातकालीन हेल्पलाइन: 1077' : 'EMERGENCY HELPLINE: 1077'}
          </a>
        </div>
      </div>

      {/* 3 Simple Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
        {/* Card 1: What to do right now */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '12px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted-bright)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isHindi ? '1. आवश्यक निर्देश (Action Required)' : '1. Action Required'}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: current.color, lineHeight: 1.5 }}>
            {isHindi ? current.doHi : current.doEn}
          </div>
        </div>

        {/* Card 2: Safe Shelter */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '12px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted-bright)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isHindi ? '2. सुरक्षित आश्रय (Safe Shelter)' : '2. Nearest Safe Shelter'}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#60a5fa', lineHeight: 1.5 }}>
            {isHindi ? current.shelterStatusHi : current.shelterStatusEn}
          </div>
        </div>

        {/* Card 3: Route & Bridge status */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '12px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted-bright)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isHindi ? '3. मार्ग स्थिति (Bridge & Roads)' : '3. Bridge & Road Access'}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: scenarioKey === 'WARNING' || scenarioKey === 'CRITICAL' ? '#ef4444' : '#22c55e', lineHeight: 1.5 }}>
            {isHindi ? current.bridgeStatusHi : current.bridgeStatusEn}
          </div>
        </div>
      </div>
    </div>
  );
}
