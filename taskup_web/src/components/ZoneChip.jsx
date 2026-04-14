// ============================================
// ZONE CHIP COMPONENT
// Selectable zone pill with color indicator
// ============================================

import './ZoneChip.css';

export default function ZoneChip({
  zone,
  selected = false,
  onClick,
  onDelete,
  showDelete = false,
}) {
  return (
    <button
      type="button"
      className={`zone-chip ${selected ? 'zone-chip--selected' : ''}`}
      onClick={onClick}
      style={{
        '--zone-color': zone.color,
        borderColor: selected ? zone.color : 'var(--color-border)',
      }}
    >
      <span
        className="zone-chip__color"
        style={{ backgroundColor: zone.color }}
      />
      <span className="zone-chip__name">{zone.name}</span>
      {showDelete && onDelete && (
        <span
          className="zone-chip__delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(zone);
          }}
          role="button"
          aria-label={`Delete ${zone.name}`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
      )}
    </button>
  );
}
