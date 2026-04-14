// ============================================
// ZONES SCREEN - Onboarding Zone Selection
// FIX: Removed DEFAULT_ZONES mutation bug
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import ZoneChip from '../components/ZoneChip';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../theme';

// FIX: Use a const for preset zones (not mutated)
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

export default function ZonesScreen({ navigation }) {
  const { userProfile } = useAuth();
  const { addZone } = useTasks();
  const [selectedZones, setSelectedZones] = useState([]);
  const [customZones, setCustomZones] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneColor, setNewZoneColor] = useState(ZONE_COLORS[0]);
  const [loading, setLoading] = useState(false);

  const toggleZone = (zoneName) => {
    setSelectedZones((prev) =>
      prev.includes(zoneName)
        ? prev.filter((z) => z !== zoneName)
        : [...prev, zoneName]
    );
  };

  const isSelected = (zoneName) => {
    return selectedZones.includes(zoneName) ||
           customZones.some((z) => z.name === zoneName);
  };

  const handleAddCustomZone = () => {
    if (!newZoneName.trim()) {
      Alert.alert('Error', 'Zone name is required');
      return;
    }

    const zoneName = newZoneName.trim();
    if (PRESET_ZONES.some((z) => z.name.toLowerCase() === zoneName.toLowerCase()) ||
        customZones.some((z) => z.name.toLowerCase() === zoneName.toLowerCase())) {
      Alert.alert('Error', 'A zone with this name already exists');
      return;
    }

    setCustomZones((prev) => [...prev, { name: zoneName, color: newZoneColor }]);
    setNewZoneName('');
    setNewZoneColor(ZONE_COLORS[0]);
    setShowAddModal(false);
  };

  const handleContinue = async () => {
    const allZones = [
      ...selectedZones.map((name) => PRESET_ZONES.find((z) => z.name === name)),
      ...customZones,
    ].filter(Boolean);

    if (allZones.length === 0) {
      Alert.alert('Error', 'Please select at least one zone');
      return;
    }

    setLoading(true);
    try {
      await Promise.all(allZones.map((zone) => addZone({ name: zone.name, color: zone.color })));
      navigation.replace('Main');
    } catch (err) {
      Alert.alert('Error', 'Failed to save zones. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigation.replace('Main');
  };

  const firstName = userProfile?.name?.split(' ')[0] || 'there';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome, {firstName}!</Text>
          <Text style={styles.subtitle}>
            Choose the zones that fit your study life. You can always add or remove zones later.
          </Text>
        </View>

        {/* Preset Zones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Your Zones</Text>
          <View style={styles.zonesGrid}>
            {PRESET_ZONES.map((zone) => (
              <ZoneChip
                key={zone.name}
                zone={zone}
                selected={isSelected(zone.name)}
                onPress={() => toggleZone(zone.name)}
              />
            ))}
          </View>
        </View>

        {/* Custom Zones */}
        {customZones.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Custom Zones</Text>
            <View style={styles.zonesGrid}>
              {customZones.map((zone) => (
                <ZoneChip
                  key={zone.name}
                  zone={zone}
                  selected={true}
                  showDelete={true}
                  onDelete={() => setCustomZones((prev) => prev.filter((z) => z.name !== zone.name))}
                />
              ))}
            </View>
          </View>
        )}

        {/* Add Custom Zone Button */}
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={20} color={COLORS.light.textMuted} />
          <Text style={styles.addBtnText}>Add Custom Zone</Text>
        </TouchableOpacity>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip for Now</Text>
          </TouchableOpacity>
          <PrimaryButton onPress={handleContinue} disabled={loading}>
            {loading ? 'Setting Up...' : 'Continue'}
          </PrimaryButton>
        </View>
      </ScrollView>

      {/* Add Zone Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Zone</Text>

            <InputField
              label="Zone Name"
              value={newZoneName}
              onChangeText={setNewZoneName}
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
                    newZoneColor === color && styles.colorSelected,
                  ]}
                  onPress={() => setNewZoneColor(color)}
                />
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setShowAddModal(false);
                  setNewZoneName('');
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <PrimaryButton onPress={handleAddCustomZone}>Create Zone</PrimaryButton>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  scrollContent: {
    padding: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.xxl,
  },
  title: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.light.textSecondary,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.lg,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
  },
  zonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xl,
  },
  addBtnText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: COLORS.light.textMuted,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  skipBtn: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  skipText: {
    color: COLORS.light.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
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
