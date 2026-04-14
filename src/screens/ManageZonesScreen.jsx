import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  StyleSheet, FlatList, Alert, StatusBar,
  Modal,
} from 'react-native';
import { useTasks } from '../contexts/TaskContext';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import EmptyState from '../components/EmptyState';
import ZoneCard from '../components/ZoneCard';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';

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

export default function ManageZonesScreen({ navigation }) {
  const { zones, fetchZones, addZone, updateZone, deleteZone } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [zoneName, setZoneName] = useState('');
  const [zoneColor, setZoneColor] = useState(ZONE_COLOR_OPTIONS[0].hex);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchZones(); }, []);

  // Open modal for add / edit
  const openAdd = () => {
    setEditingZone(null);
    setZoneName('');
    setZoneColor(ZONE_COLOR_OPTIONS[0].hex);
    setShowModal(true);
  };

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
      Alert.alert('Name Required', 'Please enter a zone name.');
      return;
    }
    // Check for duplicate names (exclude current editing zone)
    const duplicate = zones.find(
      z => z.name.toLowerCase() === trimmed.toLowerCase() && z.id !== editingZone?.id
    );
    if (duplicate) {
      Alert.alert('Duplicate', 'A zone with this name already exists.');
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
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete zone with confirmation
  const handleDelete = (zone) => {
    if (zones.length <= 1) {
      Alert.alert('Cannot Delete', 'You need at least one zone.');
      return;
    }
    Alert.alert(
      'Delete Zone',
      `Delete "${zone.name}"? Tasks in this zone will be moved to another zone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteZone(zone.id);
            } catch (e) {
              Alert.alert('Error', e.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundCream} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Manage Zones</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.subtitle}>
        Customize your zones to organize tasks your way. Tap Edit to rename or recolor, or Delete to remove.
      </Text>

      {/* Zone list */}
      <FlatList
        data={zones}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <ZoneCard
            zone={item}
            index={index}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            title="No zones yet"
            message="Create your first zone to start organizing tasks."
          />
        }
      />

      {/* Add zone button */}
      <View style={styles.bottomBar}>
        <PrimaryButton
          label="Add New Zone"
          onPress={openAdd}
        />
      </View>

      {/* ── Add/Edit Modal ── */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Modal header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingZone ? 'Edit Zone' : 'New Zone'}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.closeText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {/* Preview */}
            <View style={styles.previewWrap}>
              <View style={[styles.previewCard, { borderColor: zoneColor }]}>
                <View style={[styles.previewDot, { backgroundColor: zoneColor }]} />
                <Text style={styles.previewName}>
                  {zoneName.trim() || 'Zone Name'}
                </Text>
              </View>
            </View>

            {/* Name input */}
            <Text style={styles.fieldLabel}>ZONE NAME</Text>
            <TextInput
              style={styles.input}
              value={zoneName}
              onChangeText={setZoneName}
              placeholder="e.g. Study Group"
              placeholderTextColor={COLORS.mutedText}
              autoCapitalize="words"
              autoFocus
              maxLength={30}
            />

            {/* Color picker */}
            <Text style={styles.fieldLabel}>COLOR</Text>
            <View style={styles.colorGrid}>
              {ZONE_COLOR_OPTIONS.map(c => (
                <TouchableOpacity
                  key={c.hex}
                  style={[
                    styles.colorOption,
                    { backgroundColor: c.hex },
                    zoneColor === c.hex && styles.colorSelected,
                  ]}
                  onPress={() => setZoneColor(c.hex)}
                  activeOpacity={0.8}
                >
                  {zoneColor === c.hex && (
                    <View style={styles.colorCheck} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Save */}
            <PrimaryButton
              label={editingZone ? 'Save Changes' : 'Create Zone'}
              onPress={handleSave}
              loading={saving}
              disabled={saving}
              style={{ marginTop: SPACING.xl }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: 56,
    paddingBottom: SPACING.lg,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryMoss,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.textCharcoal,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.mutedText,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  list: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
  },
  zoneCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    ...SHADOWS.soft,
  },
  colorStripe: {
    height: 3,
    width: '100%',
  },
  zoneBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  zoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.md,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: COLORS.textCharcoal,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textCharcoal,
    textTransform: 'uppercase',
    flex: 1,
  },
  zoneActions: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  actionBtn: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  editText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.accentClay,
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.criticalRose,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
    backgroundColor: COLORS.backgroundCream,
    borderTopWidth: 1,
    borderTopColor: COLORS.softBorder,
  },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26,26,26,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.sm,
    borderTopRightRadius: RADIUS.sm,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: COLORS.softBorder,
    padding: SPACING.xxl,
    paddingBottom: SPACING.section,
    ...SHADOWS.elevated,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textCharcoal,
    textTransform: 'uppercase',
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.mutedText,
  },
  previewWrap: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    borderWidth: 3,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    minWidth: 180,
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  previewDot: {
    width: 14,
    height: 14,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: COLORS.textCharcoal,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    color: COLORS.textCharcoal,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryMoss,
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    color: COLORS.textCharcoal,
    padding: SPACING.lg,
    borderRadius: RADIUS.sm,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.lg,
    ...SHADOWS.soft,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: COLORS.softBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSelected: {
    borderWidth: 4,
    borderColor: COLORS.textCharcoal,
    ...SHADOWS.button,
  },
  colorCheck: {
    width: 16,
    height: 16,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: COLORS.textCharcoal,
    backgroundColor: COLORS.white,
  },
});
