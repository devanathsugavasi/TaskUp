// ============================================
// PRIORITY PICKER COMPONENT
// Selectable priority options with color coding
// ============================================

import { PRIORITY_LEVELS } from '../contexts/TaskContext';
import './PriorityPicker.css';

const PRIORITIES = Object.entries(PRIORITY_LEVELS).map(([key, value]) => ({
  value: key,
  ...value,
}));

export default function PriorityPicker({ value, onChange, name = 'priority' }) {
  return (
    <div className="priority-picker" role="radiogroup" aria-label="Priority selection">
      {PRIORITIES.map((priority) => (
        <label
          key={priority.value}
          className={`priority-picker__option ${value === priority.value ? 'priority-picker__option--selected' : ''}`}
          style={{ '--priority-color': priority.color }}
        >
          <input
            type="radio"
            name={name}
            value={priority.value}
            checked={value === priority.value}
            onChange={(e) => onChange(e.target.value)}
            className="priority-picker__input"
          />
          <span className="priority-picker__indicator" />
          <span className="priority-picker__label">{priority.label}</span>
        </label>
      ))}
    </div>
  );
}
