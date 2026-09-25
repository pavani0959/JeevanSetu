/**
 * Divider — subtle horizontal or vertical separator
 * Props: vertical (bool), style
 */
export default function Divider({ vertical = false, style = {} }) {
  return (
    <div
      className={vertical ? 'divider-v' : 'divider'}
      style={style}
    />
  );
}
