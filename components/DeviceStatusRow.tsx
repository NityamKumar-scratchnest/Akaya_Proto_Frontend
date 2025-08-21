import { Battery, Lock } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Device } from '../redux/slices/devicesSlice';


// This helper helps us to check the content of the card in such a way that we can typecheck them.
const InfoCard = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <View style={styles.card}>
    <Text style={styles.cardLabel}>{label}</Text>
    <View style={styles.cardValueContainer}>
      {children}
    </View>
  </View>
);

export default function DeviceStatusRow({ device }: { device: Device }) {
  const {width} = useWindowDimensions()
  const isLargeScreen = width >= 768;
  
  return (
    <View style={ [styles.container , {}  ]}>
      {/* Status Card */}
      <InfoCard label="Status">
        <View style={[styles.statusBadge, { backgroundColor: device.status === 'Active' ? '#452ad1ff' : '#B0B0B0' }]}>
          <Text style={styles.statusBadgeText}>{device.status}</Text>
        </View>
      </InfoCard>

      {/* Lock Status Card */}
      <InfoCard label="Lock Status">
        <Lock color={device.isLocked ? '#E53935' : '#43A047'} size={16} />
        <Text style={[styles.cardValueText, { color: device.isLocked ? '#E53935' : '#43A047', marginLeft: 6 }]}>
          {device.isLocked ? 'Locked' : 'Unlocked'}
        </Text>
      </InfoCard>

      {/* Battery Card */}
      <InfoCard label="Battery">
        <Battery color="#555" size={16} />
        <Text style={[styles.cardValueText, { marginLeft: 6 }]}>{device.batteryLevel}%</Text>
      </InfoCard>

      {/* Model Card */}
      <InfoCard label="Model">
        <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.cardValueText}>{device.model}</Text>
            <Text style={styles.firmwareText}>v{device.firmwareVersion}</Text>
        </View>
      </InfoCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingVertical: 16,
    width: '100%',
  },
  card: {
    flex: 1, 
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
  },
  cardValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardValueText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  firmwareText: {
    fontSize: 8,
    color: '#888',
    marginTop: 2,
  }
});