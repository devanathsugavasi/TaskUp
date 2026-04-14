// ============================================
// FILTER TABS COMPONENT
// Horizontal scrolling tabs for filtering
// ============================================

import './FilterTabs.css';

export default function FilterTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="filter-tabs">
      <div className="filter-tabs__list">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`filter-tabs__tab ${activeTab === tab.value ? 'filter-tabs__tab--active' : ''}`}
            onClick={() => onChange(tab.value)}
          >
            {tab.icon && <span className="filter-tabs__icon">{tab.icon}</span>}
            <span className="filter-tabs__label">{tab.label}</span>
            {tab.count !== undefined && (
              <span className="filter-tabs__count">{tab.count}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
