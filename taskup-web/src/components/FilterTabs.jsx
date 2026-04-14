/**
 * FilterTabs — Horizontal scrollable filter strip
 * ─────────────────────────────────────────────────────
 * Used on Dashboard to filter tasks by zone or "All" / "Today".
 */

import React from 'react';

export default function FilterTabs({ tabs, activeTab, onTabPress }) {
  return (
    <div className="filter-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`filter-tab ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => onTabPress(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
