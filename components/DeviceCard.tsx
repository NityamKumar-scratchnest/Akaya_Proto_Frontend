// components/DeviceCard.tsx

import { BatteryFull, Droplet, Lock, Thermometer, Unlock } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Device } from '../redux/slices/devicesSlice';

interface Props {
  device: Device;
  onPress: () => void;
}

export default function DeviceCard({ device, onPress }: Props) {
  return (
      <Pressable
      onPress={() => {
        console.log('Card Pressed:', device.name); // ✅ Log 1
        onPress();
      }}
      style={styles.card}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.title}>{device.name}</Text>
        <Text
          style={[
            styles.status,
            { backgroundColor: device.status === 'Active' ? '#1e66f9ff' : '#ddd' },
          ]}
        >
          {device.status}
        </Text>
      </View>
      <Text style={styles.model}>{device.model}</Text>

      <View style={styles.row}>
        {device.isLocked ? <Lock color="red" size={16} /> : <Unlock color="green" size={16} />}
        <Text style={{ color: device.isLocked ? 'red' : 'green', marginLeft: 6 }}>
          {device.isLocked ? 'Locked' : 'Unlocked'}
        </Text>
      </View>

      <View style={styles.row}>
        <Thermometer size={16} color="red" />
        <Text style={styles.reading}>{device.temperature}°C</Text>
        <BatteryFull size={16} style={{ marginLeft: 16 }} />
        <Text style={styles.reading}>{device.batteryLevel}%</Text>
        <Droplet size={16} style={{ marginLeft: 16 }} />
        <Text style={styles.reading}>{device.humidity}%</Text>
      </View>

      <Text style={styles.updated}>
        Last update: {new Date(device.lastUpdate).toLocaleString()}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
    maxWidth: 400,
    height: 400,
  },
  title: { fontWeight: 'bold', fontSize: 16 },
  status: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 20,
    color: '#fff',
    fontSize: 12,
  },
  model: { color: '#555', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  reading: { marginLeft: 4, color: '#333' },
  updated: { fontSize: 12, color: '#777', marginTop: 10 },
});
    