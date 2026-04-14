import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, StatusBar, TextInput,
} from 'react-native';
import { useTasks } from '../contexts/TaskContext';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, SPACING, RADIUS, SHADOWS, ZONE_COLORS } from '../theme';

// Preset zones — this is the initial value; NEVER mutated directly
const PRESET_ZONES = [
  { name: 'Work Zone', color: '#A8705A' },
  { name: 'Reading Zone', color: '#5A7F66' },
  { name: 'Meeting Zone', color: '#5F7A6E' },
  { name: 'Food Zone', color: '#C58A2B' },
  { name: 'Exam Zone', color: '#B06050' },
  { name: 'Personal Zone', color: '#7A9B76' },
];

export default function ZonesScreen({ navigation }) {
  const { zones, fetchZones, addZone } = useTasks();
  const [loading, setLoading] = useState(false);
  // Use state so we can add custom zones without mutating PRESET_ZONES
  const [zoneList, setZoneList] = useState([...PRESET_ZONES]);
  const [selected, setSelected] = useState(
    PRESET_ZONES.reduce((acc, z) => ({ ...acc, [z.name]: true }), {}),
  );
  const [customName, setCustomName] = useState('');

  useEffect(() => { fetchZones(); }, []);

  useEffect(() => {
    if (zones.length > 0) navigation.replace('Main');
  }, [zones]);

  const toggleZone = (name) => {
    setSelected(prev => ({ ...prev, [name]: !prev[name] }));
  };

  // Add a custom zone to the STATE-managed list (not by mutating constant)
  const addCustomZone = () => {
    const trimmed = customName.trim();
    if (!trimmed) return;
    if (zoneList.some(z => z.name.toLowerCase() === trimmed.toLowerCase()) || selected[trimmed]) {
      Alert.alert('Duplicate', 'This zone already exists.');
      return;
    }
    // Spread into new array — not push() on the constant
    setZoneList(prev => [...prev, { name: trimmed, color: COLORS.primaryMoss }]);
    setSelected(prev => ({ ...prev, [trimmed]: true }));
    setCustomName('');
  };

  const setupZones = async () => {
    const selectedZones = zoneList.filter(z => selected[z.name]);
    if (selectedZones.length === 0) {
      Alert.alert('Select Zones', 'Please select at least one zone.');
      return;
    }
    setLoading(true);
    try {
      await Promise.all(
        selectedZones.map(z => addZone(z.name, z.color).catch(e => console.log('Zone exists?', e)))
      );
      navigation.replace('Main');
    } catch (e) {
      Alert.alert('Error', e.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundCream} />

      {/* Header */}
      <View style={styles.logoRow}>
        <View style={styles.logoBox}>
          <Text style={styles.logoT}>T</Text>
          <View style={styles.logoAccent} />
        </View>
        <Text style={styles.appName}>TaskUp</Text>
      </View>

      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.sub}>
        Select your task zones. You can customize these later.
      </Text>

      <FlatList
        data={zoneList}
        keyExtractor={item => item.name}
        scrollEnabled={false}
        renderItem={({ item }) => {
          const isSelected = selected[item.name];
          return (
            <TouchableOpacity
              style={[
                styles.zoneRow,
                isSelected && { borderColor: item.color, backgroundColor: item.color + '08' },
              ]}
              onPress={() => toggleZone(item.name)}
              activeOpacity={0.8}
            >
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text style={styles.zoneName}>{item.name}</Text>
              <View style={[styles.check, isSelected && { backgroundColor: item.color }]}>
                {isSelected && <Text style={styles.checkMark}>{'  '}</Text>}
              </View>
            </TouchableOpacity>
          );
        }}
        style={styles.list}
      />

      {/* Custom zone input */}
      <View style={styles.customRow}>
        <TextInput
          style={styles.customInput}
          value={customName}
          onChangeText={setCustomName}
          placeholder="Add custom zone..."
          placeholderTextColor={COLORS.mutedText}
          autoCapitalize="words"
        />
        <TouchableOpacity style={styles.addBtn} onPress={addCustomZone}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <PrimaryButton
        label="Get Started"
        onPress={setupZones}
        loading={loading}
        disabled={loading}
        style={{ marginTop: SPACING.xl }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
    padding: SPACING.xxl,
    paddingTop: 56,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  logoBox: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.primaryMoss,
    borderRadius: 0,
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.button,
  },
  logoT: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
    lineHeight: 24,
  },
  logoAccent: {
    position: 'absolute',
    bottom: 6,
    right: 5,
    width: 10,
    height: 2,
    backgroundColor: COLORS.accentClay,
    borderRadius: 1,
    transform: [{ rotate: '-18deg' }],
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textCharcoal,
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textCharcoal,
    marginBottom: SPACING.sm,
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
  sub: {
    fontSize: 14,
    color: COLORS.mutedText,
    marginBottom: SPACING.xxl,
    lineHeight: 22,
  },
  list: { marginBottom: SPACING.lg },
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.sm,
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    ...SHADOWS.soft,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: COLORS.textCharcoal,
    marginRight: SPACING.md,
  },
  zoneName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textCharcoal,
    textTransform: 'uppercase',
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: COLORS.textCharcoal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  customRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  customInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    color: COLORS.textCharcoal,
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    fontSize: 16,
    fontWeight: '600',
    ...SHADOWS.soft,
  },
  addBtn: {
    backgroundColor: COLORS.successSage, // Mint
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.sm,
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.button,
  },
  addBtnText: {
    color: COLORS.textCharcoal,
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
