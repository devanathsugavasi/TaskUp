// ============================================
// ZONES SCREEN - Onboarding Zone Selection
// First-time users select their initial zones
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import ZoneChip from '../components/ZoneChip';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import './ZonesScreen.css';

const PRESET_ZONES = [
  { name: 'Work', color: '#FF007F' },
  { name: 'Reading', color: '#FFD500' },
  { name: 'Meeting', color: '#00FF88' },
  { name: 'Food', color: '#00FFFF' },
  { name: 'Exam', color: '#5B4FD4' },
  { name: 'Personal', color: '#FF6B6B' },
];

const ZONE_COLORS = [
  '#FF007F', '#FFD500', '#00FF88', '#00FFFF', '#5B4FD4', '#FF6B6B',
  '#FF4500', '#9370DB', '#20B2AA', '#FF6980',
];

export default function ZonesScreen() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { addZone, zones } = useTasks();

  // Track selected zones (can select multiple)
  const [selectedZones, setSelectedZones] = useState([]);
  // Track custom zones created during onboarding
  const [customZones, setCustomZones] = useState([]);
  // Modal state for adding custom zone
  const [showAddModal, setShowAddModal] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneColor, setNewZoneColor] = useState(ZONE_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Toggle zone selection
  const toggleZone = (zoneName) => {
    setSelectedZones((prev) =>
      prev.includes(zoneName)
        ? prev.filter((z) => z !== zoneName)
        : [...prev, zoneName]
    );
  };

  // Check if zone is selected
  const isSelected = (zoneName) => {
    return selectedZones.includes(zoneName) ||
           customZones.some((z) => z.name === zoneName);
  };

  // Add custom zone
  const handleAddZone = async () => {
    if (!newZoneName.trim()) {
      setError('Zone name is required');
      return;
    }

    const zoneName = newZoneName.trim();

    // Check for duplicates
    if (PRESET_ZONES.some((z) => z.name.toLowerCase() === zoneName.toLowerCase()) ||
        customZones.some((z) => z.name.toLowerCase() === zoneName.toLowerCase())) {
      setError('A zone with this name already exists');
      return;
    }

    // Add to custom zones locally (will be saved to Firestore on continue)
    setCustomZones((prev) => [...prev, { name: zoneName, color: newZoneColor }]);
    setNewZoneName('');
    setNewZoneColor(ZONE_COLORS[0]);
    setError('');
    setShowAddModal(false);
  };

  // Remove custom zone
  const removeCustomZone = (zoneName) => {
    setCustomZones((prev) => prev.filter((z) => z.name !== zoneName));
  };

  // Handle continue - save zones to Firestore and navigate to dashboard
  const handleContinue = async () => {
    // Combine preset zones and custom zones
    const allZones = [
      ...selectedZones.map((name) => PRESET_ZONES.find((z) => z.name === name)),
      ...customZones,
    ].filter(Boolean);

    if (allZones.length === 0) {
      setError('Please select at least one zone');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Save each zone to Firestore
      const savePromises = allZones.map((zone) =>
        addZone({ name: zone.name, color: zone.color })
      );
      await Promise.all(savePromises);

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving zones:', err);
      setError('Failed to save zones. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Skip onboarding (not recommended - user will have no zones)
  const handleSkip = () => {
    navigate('/dashboard');
  };

  // Get user's first name for greeting
  const firstName = userProfile?.name?.split(' ')[0] || 'there';

  return (
    <div className="zones-screen">
      <div className="zones-container">
        <div className="zones-header">
          <h1 className="zones-title">Welcome, {firstName}!</h1>
          <p className="zones-subtitle">
            Choose the zones that fit your study life. You can always add or remove zones later.
          </p>
        </div>

        {error && <div className="zones-error">{error}</div>}

        <div className="zones-section">
          <h2 className="zones-section-title">Select Your Zones</h2>
          <div className="zones-grid">
            {PRESET_ZONES.map((zone) => (
              <ZoneChip
                key={zone.name}
                zone={zone}
                selected={isSelected(zone.name)}
                onClick={() => toggleZone(zone.name)}
              />
            ))}
          </div>
        </div>

        {customZones.length > 0 && (
          <div className="zones-section">
            <h2 className="zones-section-title">Your Custom Zones</h2>
            <div className="zones-grid">
              {customZones.map((zone) => (
                <ZoneChip
                  key={zone.name}
                  zone={zone}
                  selected={true}
                  showDelete={true}
                  onDelete={removeCustomZone}
                  onClick={() => removeCustomZone(zone.name)}
                />
              ))}
            </div>
          </div>
        )}

        <button
          className="zones-add-btn"
          onClick={() => setShowAddModal(true)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Custom Zone
        </button>

        <div className="zones-actions">
          <SecondaryButton onClick={handleSkip}>
            Skip for Now
          </SecondaryButton>
          <PrimaryButton onClick={handleContinue} disabled={loading}>
            {loading ? 'Setting Up...' : 'Continue to Dashboard'}
          </PrimaryButton>
        </div>
      </div>

      {/* Add Custom Zone Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setError('');
          setNewZoneName('');
        }}
        title="Create Zone"
        footer={
          <>
            <SecondaryButton onClick={() => setShowAddModal(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleAddZone}>
              Create Zone
            </PrimaryButton>
          </>
        }
      >
        <div className="add-zone-form">
          {error && <div className="zones-error">{error}</div>}

          <InputField
            label="Zone Name"
            value={newZoneName}
            onChange={(e) => setNewZoneName(e.target.value)}
            placeholder="e.g., Research, Lab Work"
            maxLength={30}
          />

          <div className="color-picker">
            <label className="color-picker__label">Zone Color</label>
            <div className="color-picker__options">
              {ZONE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-picker__option ${newZoneColor === color ? 'color-picker__option--selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewZoneColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
