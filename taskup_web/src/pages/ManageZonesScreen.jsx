// ============================================
// MANAGE ZONES SCREEN - Zone CRUD Operations
// Full zone management with add, edit, delete functionality
// ============================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext';
import { PrimaryButton, SecondaryButton, DangerButton } from '../components/Button';
import Modal, { ConfirmModal } from '../components/Modal';
import InputField from '../components/InputField';
import './ManageZonesScreen.css';

const ZONE_COLORS = [
  '#FF007F', '#FFD500', '#00FF88', '#00FFFF', '#5B4FD4', '#FF6B6B',
  '#FF4500', '#9370DB', '#20B2AA', '#FF6980',
];

export default function ManageZonesScreen() {
  const { zones, tasks, addZone, updateZone, deleteZone } = useTasks();

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [editingZone, setEditingZone] = useState(null);
  const [zoneToDelete, setZoneToDelete] = useState(null);
  const [formData, setFormData] = useState({ name: '', color: ZONE_COLORS[0] });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', color: ZONE_COLORS[0] });
    setErrors({});
    setEditingZone(null);
  };

  // Open add modal
  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Open edit modal
  const openEditModal = (zone) => {
    setEditingZone(zone);
    setFormData({ name: zone.name, color: zone.color });
    setShowEditModal(true);
  };

  // Open delete confirmation
  const openDeleteConfirm = (zone) => {
    setZoneToDelete(zone);
    setShowDeleteConfirm(true);
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Zone name is required';
    } else if (formData.name.length > 30) {
      newErrors.name = 'Zone name must be 30 characters or less';
    }

    // Check for duplicate names (excluding current zone if editing)
    const duplicate = zones.some(
      (z) =>
        z.name.toLowerCase() === formData.name.trim().toLowerCase() &&
        z.id !== editingZone?.id
    );
    if (duplicate) {
      newErrors.name = 'A zone with this name already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle add zone
  const handleAddZone = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await addZone({ name: formData.name.trim(), color: formData.color });
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('Error adding zone:', err);
      setErrors({ name: 'Failed to add zone. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle update zone
  const handleUpdateZone = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updateZone(editingZone.id, {
        name: formData.name.trim(),
        color: formData.color,
      });
      setShowEditModal(false);
      resetForm();
    } catch (err) {
      console.error('Error updating zone:', err);
      setErrors({ name: 'Failed to update zone. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete zone
  const handleDeleteZone = async () => {
    if (!zoneToDelete) return;

    setLoading(true);
    try {
      await deleteZone(zoneToDelete.id, zoneToDelete.name);
      setShowDeleteConfirm(false);
      setZoneToDelete(null);
    } catch (err) {
      console.error('Error deleting zone:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get task count for a zone
  const getZoneTaskCount = (zoneName) => {
    return tasks.filter((t) => t.zone === zoneName).length;
  };

  return (
    <div className="manage-zones-screen">
      <div className="manage-zones-container">
        {/* Header */}
        <header className="manage-zones-header">
          <Link to="/dashboard" className="manage-zones-back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </Link>
          <h1 className="manage-zones-title">Manage Zones</h1>
          <PrimaryButton onClick={openAddModal}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Zone
          </PrimaryButton>
        </header>

        {/* Zones List */}
        <div className="zones-list">
          {zones.length === 0 ? (
            <div className="zones-empty">
              <p>No zones yet. Create your first zone to organize your tasks.</p>
            </div>
          ) : (
            zones.map((zone) => (
              <div key={zone.id} className="zone-card">
                <div className="zone-card__color" style={{ backgroundColor: zone.color }} />
                <div className="zone-card__info">
                  <span className="zone-card__name">{zone.name}</span>
                  <span className="zone-card__count">
                    {getZoneTaskCount(zone.name)} {getZoneTaskCount(zone.name) === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
                <div className="zone-card__actions">
                  <button
                    className="zone-card__btn"
                    onClick={() => openEditModal(zone)}
                    aria-label="Edit zone"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M11 2.5L13.5 5L5 13H2.5V10.5L11 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    className="zone-card__btn zone-card__btn--delete"
                    onClick={() => openDeleteConfirm(zone)}
                    aria-label="Delete zone"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 4H13L12 14H4L3 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M2 4H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M6 2H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Zone Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Create Zone"
        footer={
          <>
            <SecondaryButton onClick={() => setShowAddModal(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleAddZone} disabled={loading}>
              {loading ? 'Creating...' : 'Create Zone'}
            </PrimaryButton>
          </>
        }
      >
        <ZoneForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onColorSelect={handleColorSelect}
        />
      </Modal>

      {/* Edit Zone Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title="Edit Zone"
        footer={
          <>
            <SecondaryButton onClick={() => setShowEditModal(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleUpdateZone} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </PrimaryButton>
          </>
        }
      >
        <ZoneForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onColorSelect={handleColorSelect}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setZoneToDelete(null);
        }}
        onConfirm={handleDeleteZone}
        title="Delete Zone"
        message={`Are you sure you want to delete "${zoneToDelete?.name}"? Tasks in this zone will be reassigned to another zone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}

// Zone Form Component (extracted to fix hooks violation)
function ZoneForm({ formData, errors, onChange, onColorSelect }) {
  return (
    <div className="zone-form">
      <InputField
        label="Zone Name"
        name="name"
        type="text"
        value={formData.name}
        onChange={onChange}
        placeholder="e.g., Research, Lab Work"
        maxLength={30}
        error={errors.name}
      />

      <div className="color-picker">
        <label className="color-picker__label">Zone Color</label>
        <div className="color-picker__options">
          {ZONE_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`color-picker__option ${formData.color === color ? 'color-picker__option--selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
