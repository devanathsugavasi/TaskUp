import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  StyleSheet, FlatList, Alert, StatusBar,
  Animated, Modal,
} from 'react-native';
import { useTasks } from '../contexts/TaskContext';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import EmptyState from '../components/EmptyState';
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

  // ── Open modal for add / edit ──
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

  // ── Save zone ──
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

  // ── Delete zone ──
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

  // ── Render zone card ──
  const renderZone = ({ item, index }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 60,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>
        <View style={styles.zoneCard}>
          {/* Color accent */}
          <View style={[styles.colorStripe, { backgroundColor: item.color || COLORS.primaryMoss }]} />

          <View style={styles.zoneBody}>
            <View style={styles.zoneInfo}>
              <View style={[styles.colorDot, { backgroundColor: item.color || COLORS.primaryMoss }]} />
              <Text style={styles.zoneName}>{item.name}</Text>
            </View>

            <View style={styles.zoneActions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => openEdit(item)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleDelete(item)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
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
        renderItem={renderZone}
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
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textCharcoal,
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
    backgroundColor: COLORS.softSurface,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
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
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textCharcoal,
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
    borderTopLeftRadius: RADIUS.xxl + 4,
    borderTopRightRadius: RADIUS.xxl + 4,
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
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textCharcoal,
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
    backgroundColor: COLORS.softSurface,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    minWidth: 180,
    justifyContent: 'center',
  },
  previewDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  previewName: {
    fontSize: 15,
    fontWeight: '600',
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
    backgroundColor: COLORS.softSurface,
    borderWidth: 1,
    borderColor: COLORS.softBorder,
    color: COLORS.textCharcoal,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    fontSize: 16,
    marginBottom: SPACING.lg,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  colorCheck: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.white,
  },
});
