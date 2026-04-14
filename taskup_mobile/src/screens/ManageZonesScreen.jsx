// ============================================
// MANAGE ZONES SCREEN - Zone CRUD Operations
// FIX: Extracted ZoneCard to separate component (fixes hooks violation)
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../contexts/TaskContext';
import ZoneChip from '../components/ZoneChip';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../theme';

const ZONE_COLORS = [
  '#FF007F', '#FFD500', '#00FF88', '#00FFFF', '#5B4FD4', '#FF6B6B',
  '#FF4500', '#9370DB', '#20B2AA', '#FF6980',
];

export default function ManageZonesScreen({ navigation }) {
  const { zones, tasks, addZone, updateZone, deleteZone } = useTasks();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [zoneName, setZoneName] = useState('');
  const [zoneColor, setZoneColor] = useState(ZONE_COLORS[0]);
  const [loading, setLoading] = useState(false);

  const openAddModal = () => {
    setZoneName('');
    setZoneColor(ZONE_COLORS[0]);
    setShowAddModal(true);
  };

  const openEditModal = (zone) => {
    setEditingZone(zone);
    setZoneName(zone.name);
    setZoneColor(zone.color);
    setShowEditModal(true);
  };

  const handleAddZone = async () => {
    if (!zoneName.trim()) {
      Alert.alert('Error', 'Zone name is required');
      return;
    }

    const duplicate = zones.some(
      (z) => z.name.toLowerCase() === zoneName.trim().toLowerCase()
    );
    if (duplicate) {
      Alert.alert('Error', 'A zone with this name already exists');
      return;
    }

    setLoading(true);
    try {
      await addZone({ name: zoneName.trim(), color: zoneColor });
      setShowAddModal(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to add zone');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateZone = async () => {
    if (!zoneName.trim()) {
      Alert.alert('Error', 'Zone name is required');
      return;
    }

    const duplicate = zones.some(
      (z) =>
        z.name.toLowerCase() === zoneName.trim().toLowerCase() &&
        z.id !== editingZone.id
    );
    if (duplicate) {
      Alert.alert('Error', 'A zone with this name already exists');
      return;
    }

    setLoading(true);
    try {
      await updateZone(editingZone.id, { name: zoneName.trim(), color: zoneColor });
      setShowEditModal(false);
      setEditingZone(null);
    } catch (err) {
      Alert.alert('Error', 'Failed to update zone');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteZone = (zone) => {
    Alert.alert(
      'Delete Zone',
      `Are you sure you want to delete "${zone.name}"? Tasks will be reassigned.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteZone(zone.id, zone.name);
            } catch (err) {
              Alert.alert('Error', 'Failed to delete zone');
            }
          },
        },
      ]
    );
  };

  const getTaskCount = (zoneName) => {
    return tasks.filter((t) => t.zone === zoneName).length;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Zones</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Zones List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {zones.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No zones yet. Create your first zone!</Text>
          </View>
        ) : (
          zones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              taskCount={getTaskCount(zone.name)}
              onEdit={() => openEditModal(zone)}
              onDelete={() => handleDeleteZone(zone)}
            />
          ))
        )}
      </ScrollView>

      {/* Add Zone Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Zone</Text>

            <InputField
              label="Zone Name"
              value={zoneName}
              onChangeText={setZoneName}
              placeholder="e.g., Research"
              maxLength={30}
            />

            <Text style={styles.colorLabel}>Zone Color</Text>
            <View style={styles.colorGrid}>
              {ZONE_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    zoneColor === color && styles.colorSelected,
                  ]}
                  onPress={() => setZoneColor(color)}
                />
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <PrimaryButton onPress={handleAddZone} disabled={loading}>
                {loading ? 'Creating...' : 'Create Zone'}
              </PrimaryButton>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Zone Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Zone</Text>

            <InputField
              label="Zone Name"
              value={zoneName}
              onChangeText={setZoneName}
              placeholder="Zone name"
              maxLength={30}
            />

            <Text style={styles.colorLabel}>Zone Color</Text>
            <View style={styles.colorGrid}>
              {ZONE_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    zoneColor === color && styles.colorSelected,
                  ]}
                  onPress={() => setZoneColor(color)}
                />
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setShowEditModal(false);
                  setEditingZone(null);
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <PrimaryButton onPress={handleUpdateZone} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </PrimaryButton>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// FIX: Extracted ZoneCard to separate component (fixes hooks violation)
// Previously, ZoneCard was defined inside renderItem which violates hooks rules
function ZoneCard({ zone, taskCount, onEdit, onDelete }) {
  return (
    <View style={styles.zoneCard}>
      <View style={[styles.zoneColor, { backgroundColor: zone.color }]} />
      <View style={styles.zoneInfo}>
        <Text style={styles.zoneName}>{zone.name}</Text>
        <Text style={styles.zoneCount}>
          {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
        </Text>
      </View>
      <View style={styles.zoneActions}>
        <TouchableOpacity style={styles.zoneBtn} onPress={onEdit}>
          <Ionicons name="pencil" size={18} color={COLORS.light.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoneBtn} onPress={onDelete}>
          <Ionicons name="trash" size={18} color={COLORS.accent.pink} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.light.border,
  },
  headerTitle: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xxl,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  addBtn: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.accent.yellow,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    color: COLORS.light.textMuted,
    fontSize: FONT_SIZES.md,
  },
  zoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  zoneColor: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.light.border,
    marginRight: SPACING.md,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.md,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  zoneCount: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    color: COLORS.light.textMuted,
  },
  zoneActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  zoneBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.light.card,
    borderWidth: 2,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
  },
  modalTitle: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xxl,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: SPACING.lg,
  },
  colorLabel: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
  },
  colorSelected: {
    borderWidth: 4,
    borderColor: '#000',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
  },
  cancelBtn: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  cancelText: {
    color: COLORS.light.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
