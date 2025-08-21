import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DeviceDetailsCardsProps {
  device: {
    temperature: number;
    humidity: number;
    status: string;
    lastUpdated: string;
    location?: {
      address?: string;
      lat?: number;
      lng?: number;
    };
  };
}

export default function DeviceDetailsCards({ device }: DeviceDetailsCardsProps) {
  const { temperature, humidity, status, lastUpdated, location } = device;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.label}>Temperature</Text>
          <Text style={styles.value}>{temperature}°C</Text>
          <Text style={styles.subtext}>Normal range: 18–25°C</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Humidity</Text>
          <Text style={styles.value}>{humidity}%</Text>
          <Text style={styles.subtext}>Normal range: 40–70%</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
          <Text style={styles.subtext}>Last update: {lastUpdated}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{location?.address}</Text>
          <Text style={styles.subtext}>
            {location?.lat}, {location?.lng}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 12 },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: { fontSize: 14, color: '#666', marginBottom: 4 },
  value: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  subtext: { fontSize: 12, color: '#888', marginTop: 6 },
  statusBadge: {
    backgroundColor: '#007bff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});
