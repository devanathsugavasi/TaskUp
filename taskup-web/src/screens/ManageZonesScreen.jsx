/**
 * ManageZonesScreen — Zone CRUD with color picker
 * ─────────────────────────────────────────────────────
 * Features:
 * - List all user zones with color stripes
 * - Edit zone name and color via modal
 * - Delete zone with confirmation (tasks reassigned)
 * - Add new zone button
 * - ZoneCard as a proper component (NOT using hooks inside callbacks)
 *
 * BUG FIX: ZoneCard is a standalone component, so useRef/useEffect
 * are called at the top level (fixes the React Hooks violation from
 * the mobile app where hooks were called inside renderItem).
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext';
import PrimaryButton from '../components/PrimaryButton';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import InputField from '../components/InputField';

// Available zone colors
const ZONE_COLOR_OPTIONS = [
  { name: 'Clay',    hex: '#A8705A' },
  { name: 'Sage',    hex: '#5A7F66' },
  { name: 'Olive',   hex: '#5F7A6E' },
  { name: 'Amber',   hex: '#C58A2B' },
  { name: 'Rose',    hex: '#B06050' },
  { name: 'Moss',    hex: '#7A9B76' },
  { name: 'Slate',   hex: '#6B7F8E' },
  { name: 'Berry',   hex: '#8E5A7B' },
  { name: 'Copper',  hex: '#CC5833' },
  { name: 'Forest',  hex: '#2E4036' },
];

/**
 * ZoneCard — Individual zone card component
 * This is a SEPARATE component (not inline in a callback) to ensure
 * React Hooks rules are respected. This fixes the original bug where
 * useRef and useEffect were called inside renderItem.
 */
function ZoneCard({ zone, onEdit, onDelete }) {
  return (
    <div className="zone-card">
      {/* Color stripe at the top */}
      <div className="zone-stripe" style={{ backgroundColor: zone.color || '#000' }} />
      {/* Card body */}
      <div className="zone-card-body">
        <div className="zone-card-info">
          <div className="zone-card-dot" style={{ backgroundColor: zone.color || '#000' }} />
          <span className="zone-card-name">{zone.name}</span>
        </div>
        <div className="zone-card-actions">
          <button className="action-edit" onClick={() => onEdit(zone)}>Edit</button>
          <button className="action-delete" onClick={() => onDelete(zone)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function ManageZonesScreen() {
  const navigate = useNavigate();
  const { zones, addZone, updateZone, deleteZone } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [zoneName, setZoneName] = useState('');
  const [zoneColor, setZoneColor] = useState(ZONE_COLOR_OPTIONS[0].hex);
  const [saving, setSaving] = useState(false);

  // Open modal for adding a new zone
  const openAdd = () => {
    setEditingZone(null);
    setZoneName('');
    setZoneColor(ZONE_COLOR_OPTIONS[0].hex);
    setShowModal(true);
  };

  // Open modal for editing an existing zone
  const openEdit = (zone) => {
    setEditingZone(zone);
    setZoneName(zone.name);
    setZoneColor(zone.color || ZONE_COLOR_OPTIONS[0].hex);
    setShowModal(true);
  };

  // Save zone (create or update)
  const handleSave = async () => {
    const trimmed = zoneName.trim();
    if (!trimmed) {
      alert('Please enter a zone name.');
      return;
    }
    // Check for duplicate names (exclude the zone being edited)
    const duplicate = zones.find(
      (z) => z.name.toLowerCase() === trimmed.toLowerCase() && z.id !== editingZone?.id,
    );
    if (duplicate) {
      alert('A zone with this name already exists.');
      return;
    }
    setSaving(true);
    try {
      if (editingZone) {
        await updateZone(editingZone.id, { name: trimmed, color: zoneColor });
      } else {
        await addZone(trimmed, zoneColor);
      }
      setShowModal(false);
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete zone with confirmation
  const handleDelete = (zone) => {
    if (zones.length <= 1) {
      alert('You need at least one zone.');
      return;
    }
    if (!window.confirm(`Delete "${zone.name}"? Tasks in this zone will be moved to another zone.`)) return;
    deleteZone(zone.id).catch((e) => alert('Error: ' + e.message));
  };

  return (
    <div style={{ maxWidth: 600 }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-lg">
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', fontSize: 14, fontWeight: 600, color: 'var(--color-accent-pink)', cursor: 'pointer' }}
        >
          Back
        </button>
        <h2>Manage Zones</h2>
        <div style={{ width: 40 }} />
      </div>

      <p className="text-muted mb-xl" style={{ fontSize: 13, lineHeight: 1.6 }}>
        Customize your zones to organize tasks your way. Click Edit to rename or recolor, or Delete to remove.
      </p>

      {/* Zone list — each zone rendered as a proper ZoneCard component */}
      {zones.length === 0 ? (
        <EmptyState title="No zones yet" message="Create your first zone to start organizing tasks." />
      ) : (
        zones.map((zone) => (
          <ZoneCard key={zone.id} zone={zone} onEdit={openEdit} onDelete={handleDelete} />
        ))
      )}

      {/* Add zone button */}
      <PrimaryButton label="Add New Zone" onClick={openAdd} style={{ marginTop: 'var(--space-xl)' }} />

      {/* Add/Edit Zone Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingZone ? 'Edit Zone' : 'New Zone'}>
        {/* Preview */}
        <div className="text-center mb-xxl">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--space-md)',
            background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)',
            border: `3px solid ${zoneColor}`, padding: '12px 20px',
            boxShadow: 'var(--shadow-soft)',
          }}>
            <div style={{ width: 14, height: 14, background: zoneColor, border: '2px solid var(--color-border)' }} />
            <span style={{ fontSize: 16, fontWeight: 800, textTransform: 'uppercase' }}>
              {zoneName.trim() || 'Zone Name'}
            </span>
          </div>
        </div>

        {/* Name input */}
        <InputField label="Zone Name" value={zoneName} onChange={setZoneName} placeholder="e.g. Study Group" maxLength={30} />

        {/* Color picker grid */}
        <label className="input-label">Color</label>
        <div className="color-grid mb-lg">
          {ZONE_COLOR_OPTIONS.map((c) => (
            <div
              key={c.hex}
              className={`color-option ${zoneColor === c.hex ? 'selected' : ''}`}
              style={{ backgroundColor: c.hex }}
              onClick={() => setZoneColor(c.hex)}
            >
              {zoneColor === c.hex && <div className="color-check" />}
            </div>
          ))}
        </div>

        <PrimaryButton
          label={editingZone ? 'Save Changes' : 'Create Zone'}
          onClick={handleSave}
          loading={saving}
          style={{ marginTop: 'var(--space-xl)' }}
        />
      </Modal>
    </div>
  );
}
