// ============================================
// SEARCH BAR COMPONENT
// Text input with search icon and clear button
// ============================================

import './SearchBar.css';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search tasks...',
  onClear,
}) {
  return (
    <div className="search-bar">
      <svg
        className="search-bar__icon"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2"/>
        <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-bar__input"
      />
      {value && onClear && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={onClear}
          aria-label="Clear search"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}
