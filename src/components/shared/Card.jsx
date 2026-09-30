/**
 * Card — Glassmorphism panel wrapper
 * Props: children, className, style, title, titleRight, noPad
 */
export default function Card({ children, className = '', style = {}, title, titleRight, noPad = false }) {
  return (
    <div
      className={`glass-card ${className}`}
      style={{ display: 'flex', flexDirection: 'column', ...style }}
    >
      {title && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: noPad ? '14px 16px 12px' : '14px 16px 0',
            borderBottom: title ? '1px solid rgba(255,255,255,0.05)' : 'none',
            marginBottom: title && !noPad ? '12px' : 0,
          }}
        >
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-muted-bright)',
            }}
          >
            {title}
          </span>
          {titleRight && <span>{titleRight}</span>}
        </div>
      )}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        ...(noPad ? {} : { padding: title ? '0 16px 16px' : '16px' })
      }}>
        {children}
      </div>
    </div>
  );
}
