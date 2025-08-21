// DeviceGrid.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LucideDroplets, LucideThermometer } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { Device } from '../redux/slices/devicesSlice'; // ✅ ensure same type
import { setSelectedDevice } from '../redux/slices/devicesSlice'; // ✅ import your action
import { RootState } from '../redux/store';

const DeviceCard = ({ device }: { device: Device }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isInactive = device.status === 'Inactive';
  const [isHovered, setIsHovered] = useState(false);
  const handlePress = () => {
    dispatch(setSelectedDevice(device.id));
    router.push(`/device/${device.id}`);; 
  };
  const {width} = useWindowDimensions()
  const isSmallScreen = width < 700
// It is for the data and time in our required formate 

  const formatLastUpdate = (isoString: string) => {
  if (!isoString) return 'No data';

  const date = new Date(isoString);

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};


  return (
    <Pressable
      onPress={handlePress}
      onHoverIn={() => Platform.OS === 'web' && setIsHovered(true)}
      onHoverOut={() => Platform.OS === 'web' && setIsHovered(false)}
      style={[
        styles.card,
        isInactive && styles.inactiveCard,
        isHovered && Platform.OS === 'web' ? styles.hover : null, { elevation:isSmallScreen ? 5 : 1 }
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <View
          style={[
            styles.statusBadge,
            device.status === 'Active' ? styles.activeBadge : styles.inactiveBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              device.status === 'Active' ? styles.activeStatusText : styles.inactiveStatusText,
            ]}
          >
            {device.status}
          </Text>
        </View>
      </View>

      <Text style={styles.deviceType}>{device.model}</Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons
            name={device.isLocked ? 'lock-outline' : 'lock-open-variant-outline'}
            size={20}
            color={device.isLocked ? '#E53935' : '#43A047'}
          />
          <Text style={styles.infoText}>{device.isLocked ? 'Locked' : 'Unlocked'}</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons name="battery-outline" size={20} color="black" />
          <Text style={styles.infoText}>{device.batteryLevel}%</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <LucideThermometer size={20} color="#E53935" />
          <Text style={styles.infoText}>{device.temperature}°C</Text>
        </View>
        <View style={styles.infoItem}>
          <LucideDroplets size={20} color="#64B5F6" />
          <Text style={styles.infoText}>{device.humidity}%</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>
  Last update: {formatLastUpdate(device.lastUpdate)}
</Text>
      </View>
    </Pressable>
  );
};
interface DeviceGridProps {
  isLargeScreen: boolean;
}

export default function DeviceGrid() {
  const devices = useSelector((state: RootState) => state?.devices?.devices || []);
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  if (!devices.length) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ color: '#888' }}>No devices found.</Text>
      </View>
    );
  }

  return isLargeScreen ? (
    <View style={[styles.grid, { paddingHorizontal: 94 , paddingRight : 100 }]}>
      {devices.map(device => (
        <View key={device.id} style={[styles.gridItem ,{padding: isLargeScreen ? 6 : 6} ]}>
          <DeviceCard device={device} />
        </View>
      ))}
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {devices.map(device => (
        <View key={device.id} style={styles.item}>
          <DeviceCard device={device} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  item: {
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical : 0,
    marginHorizontal :0,
    paddingHorizontal : 10,
  },
  gridItem: {
    width: '33.33%',
    padding: 6,
    
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical : 20,
    shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    paddingBottom : 25,
 
    // borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  inactiveCard: {
    backgroundColor: '#FAFAFA',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',

  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  activeBadge: {
    backgroundColor: '#1E66F9',
    color: '#fff',
  
  },
  inactiveBadge: {
    backgroundColor: '#ed3d3dff',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeStatusText: {
    color: '#f1f4f7ff',
  },
  inactiveStatusText: {
    color: '#fffdfdff',
  },
  deviceType: {
    fontSize: 14,
    color: '#666',
    marginTop : 10,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
  hover:{
     shadowColor: '#000',
    //  shadowOffset: { width: 0, height: 2 },
    // transform: [{ scale: 1.01 }],
    
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 0,
      ...(Platform.OS === 'web' && {
      transition: 'all 0.3s ease', // Smooth transition on hover
    }),
  }
});
