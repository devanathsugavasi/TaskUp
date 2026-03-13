import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, StatusBar, TextInput,
} from 'react-native';
import { useTasks } from '../contexts/TaskContext';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, SPACING, RADIUS, SHADOWS, ZONE_COLORS } from '../theme';

const DEFAULT_ZONES = [
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
  const [selected, setSelected] = useState(
    DEFAULT_ZONES.reduce((acc, z) => ({ ...acc, [z.name]: true }), {})
  );
  const [customName, setCustomName] = useState('');

  useEffect(() => { fetchZones(); }, []);

  useEffect(() => {
    if (zones.length > 0) navigation.replace('Main');
  }, [zones]);

  const toggleZone = (name) => {
    setSelected(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const addCustomZone = () => {
    const trimmed = customName.trim();
    if (!trimmed) return;
    if (DEFAULT_ZONES.some(z => z.name === trimmed) || selected[trimmed]) {
      Alert.alert('Duplicate', 'This zone already exists.');
      return;
    }
    DEFAULT_ZONES.push({ name: trimmed, color: COLORS.primaryMoss });
    setSelected(prev => ({ ...prev, [trimmed]: true }));
    setCustomName('');
  };

  const setupZones = async () => {
    const selectedZones = DEFAULT_ZONES.filter(z => selected[z.name]);
    if (selectedZones.length === 0) {
      Alert.alert('Select Zones', 'Please select at least one zone.');
      return;
    }
    setLoading(true);
    try {
      for (const z of selectedZones) {
        await addZone(z.name, z.color);
      }
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
        data={DEFAULT_ZONES}
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
    width: 36,
    height: 36,
    backgroundColor: COLORS.primaryMoss,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm + 2,
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
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textCharcoal,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textCharcoal,
    marginBottom: SPACING.sm,
    letterSpacing: -0.3,
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
    backgroundColor: COLORS.softSurface,
    padding: SPACING.lg,
    marginBottom: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.softBorder,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.md,
  },
  zoneName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textCharcoal,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.softBorder,
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
    backgroundColor: COLORS.softSurface,
    borderWidth: 1,
    borderColor: COLORS.softBorder,
    color: COLORS.textCharcoal,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: COLORS.primaryMoss,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
