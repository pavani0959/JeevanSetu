/**
 * RoleSwitcher.jsx — Role-based view toggle
 *
 * Lets judges/evaluators switch between three user roles:
 *   1. SDMA Admin       — full command-center view
 *   2. First Responder  — field-focused: route, shelter, priority
 *   3. Volunteer        — simplified: alert + action only
 *
 * This answers the judge question: "Who is the actual user?"
 */

export const ROLES = {
  ADMIN: {
    id: 'ADMIN',
    label: 'SDMA Admin',
    labelHi: 'आपदा प्रबंधन (Admin)',
    icon: '🏛️',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.15)',
    border: 'rgba(59,130,246,0.35)',
    description: 'Full command-center dashboard · All panels visible · Situation assessment & resource allocation',
    descHi: 'पूर्ण नियंत्रण केंद्र · सभी पैनल दृश्यमान',
  },
  RESPONDER: {
    id: 'RESPONDER',
    label: 'First Responder',
    labelHi: 'बचाव दल (Responder)',
    icon: '🚨',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.15)',
    border: 'rgba(249,115,22,0.35)',
    description: 'Field-focused: safe route · shelter capacity · priority residents · bridge status',
    descHi: 'फील्ड दृश्य: सुरक्षित मार्ग · आश्रय · प्राथमिकता',
  },
  VOLUNTEER: {
    id: 'VOLUNTEER',
    label: 'Village Volunteer',
    labelHi: 'ग्राम स्वयंसेवक',
    icon: '🤝',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.15)',
    border: 'rgba(34,197,94,0.35)',
    description: 'Simplified view: alert status · immediate action · ward status only',
    descHi: 'सरल दृश्य: चेतावनी · तत्काल कार्रवाई',
  },
};

export default function RoleSwitcher({ activeRole, setActiveRole, isHindi }) {
  const role = ROLES[activeRole];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      {/* Role tabs */}
      <div style={{
        display: 'flex',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        padding: 3,
        gap: 3,
      }}>
        {Object.values(ROLES).map(r => {
          const isActive = r.id === activeRole;
          return (
            <button
              key={r.id}
              onClick={() => setActiveRole(r.id)}
              className="role-switcher"
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: 7,
                border: isActive ? `1px solid ${r.border}` : '1px solid transparent',
                background: isActive ? r.bg : 'transparent',
                color: isActive ? r.color : 'var(--color-muted-bright)',
                fontSize: 10,
                fontWeight: isActive ? 800 : 500,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.2s ease',
                letterSpacing: '0.02em',
              }}
            >
              <span style={{ fontSize: 14 }}>{r.icon}</span>
              <span>{isHindi ? r.labelHi : r.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active role description */}
      <div style={{
        padding: '8px 12px',
        background: role.bg,
        border: `1px solid ${role.border}`,
        borderRadius: 8,
        fontSize: 10,
        color: role.color,
        lineHeight: 1.5,
      }}>
        <span style={{ fontWeight: 800 }}>{role.icon} {isHindi ? role.labelHi : role.label}: </span>
        <span style={{ opacity: 0.85 }}>{isHindi ? role.descHi : role.description}</span>
      </div>
    </div>
  );
}
