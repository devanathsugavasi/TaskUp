/**
 * ZonesScreen — First-run zone picker (onboarding)
 * ─────────────────────────────────────────────────────
 * Shown immediately after sign-up.
 * User selects which preset zones they want, can add custom zones,
 * then clicks "Get Started" to create them in Firestore.
 *
 * BUG FIX: Uses useState for the zone list instead of mutating
 * a module-level constant array (fixes the original DEFAULT_ZONES.push bug).
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext';
import PrimaryButton from '../components/PrimaryButton';

// Preset zones — this is the initial value; never mutated directly
const PRESET_ZONES = [
  { name: 'Work Zone', color: '#A8705A' },
  { name: 'Reading Zone', color: '#5A7F66' },
  { name: 'Meeting Zone', color: '#5F7A6E' },
  { name: 'Food Zone', color: '#C58A2B' },
  { name: 'Exam Zone', color: '#B06050' },
  { name: 'Personal Zone', color: '#7A9B76' },
];

export default function ZonesScreen() {
  const { zones, addZone } = useTasks();
  const navigate = useNavigate();

  // Use state so we can add custom zones without mutating PRESET_ZONES
  const [zoneList, setZoneList] = useState([...PRESET_ZONES]);
  const [selected, setSelected] = useState(
    PRESET_ZONES.reduce((acc, z) => ({ ...acc, [z.name]: true }), {}),
  );
  const [customName, setCustomName] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect to dashboard if user already has zones set up
  useEffect(() => {
    if (zones.length > 0) navigate('/dashboard', { replace: true });
  }, [zones, navigate]);

  // Toggle a zone selection on/off
  const toggleZone = (name) => {
    setSelected((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Add a custom zone to the list (without mutating the original array)
  const addCustomZone = () => {
    const trimmed = customName.trim();
    if (!trimmed) return;
    // Check for duplicates
    if (zoneList.some((z) => z.name.toLowerCase() === trimmed.toLowerCase())) {
      alert('This zone already exists.');
      return;
    }
    // Add to the state-managed list (not the constant)
    setZoneList((prev) => [...prev, { name: trimmed, color: '#000000' }]);
    setSelected((prev) => ({ ...prev, [trimmed]: true }));
    setCustomName('');
  };

  // Create selected zones in Firestore and navigate to dashboard
  const handleSetup = async () => {
    const selectedZones = zoneList.filter((z) => selected[z.name]);
    if (selectedZones.length === 0) {
      alert('Please select at least one zone.');
      return;
    }
    setLoading(true);
    try {
      await Promise.all(
        selectedZones.map((z) => addZone(z.name, z.color).catch(() => {})),
      );
      navigate('/dashboard', { replace: true });
    } catch (e) {
      alert('Error: ' + e.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        {/* Logo + title */}
        <div className="flex items-center gap-md mb-xxl">
          <div className="logo-mark">
            <span className="logo-letter">T</span>
            <span className="logo-bar" />
          </div>
          <span className="logo-text">TaskUp</span>
        </div>

        <h1 style={{ marginBottom: 'var(--space-sm)' }}>Welcome</h1>
        <p className="text-muted mb-xxl">Select your task zones. You can customize these later.</p>

        {/* Zone selection list */}
        <div className="flex flex-col gap-md mb-lg">
          {zoneList.map((z) => {
            const isSelected = selected[z.name];
            return (
              <button
                key={z.name}
                onClick={() => toggleZone(z.name)}
                className="flex items-center gap-md"
                style={{
                  background: isSelected ? z.color + '08' : 'var(--color-bg-card)',
                  border: `3px solid ${isSelected ? z.color : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-lg)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-soft)',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                {/* Color dot */}
                <div style={{
                  width: 14, height: 14,
                  background: z.color,
                  border: '2px solid var(--color-border)',
                }} />
                {/* Zone name */}
                <span style={{ flex: 1, fontSize: 16, fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text)' }}>
                  {z.name}
                </span>
                {/* Checkbox */}
                <div style={{
                  width: 24, height: 24,
                  border: '2px solid var(--color-border)',
                  borderRadius: 2,
                  background: isSelected ? z.color : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isSelected && <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{'\u2713'}</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom zone input */}
        <div className="flex gap-sm mb-lg">
          <input
            className="input-field"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Add custom zone..."
            maxLength={30}
            onKeyDown={(e) => e.key === 'Enter' && addCustomZone()}
          />
          <button
            className="btn btn-accent btn-small"
            onClick={addCustomZone}
            style={{ whiteSpace: 'nowrap' }}
          >
            Add
          </button>
        </div>

        <PrimaryButton label="Get Started" onClick={handleSetup} loading={loading} />
      </div>
    </div>
  );
}
