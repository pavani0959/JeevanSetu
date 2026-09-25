import { useEffect, useRef } from 'react';

/**
 * AlertFeed — Scrollable cumulative acknowledgement timeline
 * Entries are cumulative: WATCH entries persist into WARNING and CRITICAL
 * Each entry fades in with stagger animation
 * Status colour: Sent (blue), Acknowledged (green), Action (amber)
 */

const FEED_BY_SCENARIO = {
  NORMAL: [],
  WATCH: [
    { id: 'wf1', time: '21:52', type: 'sent',   text: 'Volunteer Notification SENT — Ward 3 & 4 volunteers' },
    { id: 'wf2', time: '21:54', type: 'ack',    text: 'Acknowledged — Village Volunteer (Ramesh K.) "On standby"' },
  ],
  WARNING: [
    { id: 'wf1', time: '21:52', type: 'sent',   text: 'Volunteer Notification SENT — Ward 3 & 4 volunteers' },
    { id: 'wf2', time: '21:54', type: 'ack',    text: 'Acknowledged — Village Volunteer (Ramesh K.) "On standby"' },
    { id: 'wng1', time: '22:01', type: 'sent',  text: 'WARNING Alert SENT to Ward 4 coordinator' },
    { id: 'wng2', time: '22:02', type: 'action',text: 'Shelter PREPARING — Hilltop Community School' },
    { id: 'wng3', time: '22:03', type: 'ack',   text: 'Acknowledged — Shelter Coordinator "Opening shelter"' },
  ],
  CRITICAL: [
    { id: 'wf1', time: '21:52', type: 'sent',   text: 'Volunteer Notification SENT — Ward 3 & 4 volunteers' },
    { id: 'wf2', time: '21:54', type: 'ack',    text: 'Acknowledged — Village Volunteer (Ramesh K.) "On standby"' },
    { id: 'wng1', time: '22:01', type: 'sent',  text: 'WARNING Alert SENT to Ward 4 coordinator' },
    { id: 'wng2', time: '22:02', type: 'action',text: 'Shelter PREPARING — Hilltop Community School' },
    { id: 'wng3', time: '22:03', type: 'ack',   text: 'Acknowledged — Shelter Coordinator "Opening shelter"' },
    { id: 'cr1', time: '22:04', type: 'sent',   text: 'CRITICAL Alert SENT to Ward 4 volunteer' },
    { id: 'cr2', time: '22:04', type: 'sent',   text: 'CRITICAL Alert SENT to District Response Team' },
    { id: 'cr3', time: '22:06', type: 'ack',    text: 'Acknowledged — Village Volunteer (Ramesh K.)' },
    { id: 'cr4', time: '22:07', type: 'ack',    text: 'Acknowledged — Hilltop School Shelter Coordinator' },
    { id: 'cr5', time: '22:08', type: 'action', text: 'Shelter status updated: OPEN (87/120 capacity)' },
    { id: 'cr6', time: '22:09', type: 'action', text: 'Priority evacuation initiated — 26 residents flagged' },
  ],
};

const TYPE_CONFIG = {
  sent:   { color: '#60a5fa', icon: '📤', label: 'Sent' },
  ack:    { color: '#22c55e', icon: '✅', label: 'Ack' },
  action: { color: '#eab308', icon: '⚡', label: 'Action' },
};

export default function AlertFeed({ scenarioKey }) {
  const entries = FEED_BY_SCENARIO[scenarioKey];
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when new entries come in
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [scenarioKey]);

  if (entries.length === 0) {
    return (
      <div style={{ padding: '12px', color: 'var(--color-muted)', fontSize: '12px', textAlign: 'center' }}>
        No alerts sent. System monitoring.
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      style={{
        maxHeight: '220px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255,255,255,0.1) transparent',
      }}
    >
      {entries.map((entry, i) => {
        const cfg = TYPE_CONFIG[entry.type];
        return (
          <div
            key={entry.id}
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-start',
              padding: '6px 8px',
              borderRadius: '6px',
              background: `${cfg.color}0d`,
              border: `1px solid ${cfg.color}22`,
              animation: `feedFadeIn 0.4s ease ${i * 0.06}s both`,
            }}
          >
            {/* Time */}
            <span style={{
              fontSize: '10px',
              color: 'var(--color-muted)',
              fontVariantNumeric: 'tabular-nums',
              flexShrink: 0,
              marginTop: '1px',
              minWidth: '34px',
            }}>
              {entry.time}
            </span>

            {/* Icon */}
            <span style={{ fontSize: '12px', flexShrink: 0, marginTop: '0px' }}>{cfg.icon}</span>

            {/* Text */}
            <span style={{
              fontSize: '11px',
              color: 'var(--color-muted-bright)',
              lineHeight: 1.5,
              flex: 1,
            }}>
              {entry.text}
            </span>

            {/* Type badge */}
            <span style={{
              fontSize: '8px',
              fontWeight: 700,
              color: cfg.color,
              background: `${cfg.color}18`,
              padding: '1px 5px',
              borderRadius: '3px',
              flexShrink: 0,
              alignSelf: 'center',
            }}>
              {cfg.label}
            </span>
          </div>
        );
      })}

      <style>{`
        @keyframes feedFadeIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
