import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LucideDroplets, LucideThermometer } from 'lucide-react-native';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
export default function DeviceInfoTabs() {
  const selectedDevice = useSelector((state: RootState) => state.devices?.selectedDevice);
  const { width } = useWindowDimensions();

  if (!selectedDevice) {
    return <Text style={styles.noDeviceText}>No device selected</Text>;
  }

  // If width is less than 600, show cards in column, else row
  const isSmallScreen = width < 720;

  return (
    <View
      style={[
        styles.cardsContainer,
        {
          flexDirection: isSmallScreen ? "column" : "row",
          paddingLeft: isSmallScreen ? 0 : 26,
          paddingRight: 0,
          width: width * 0.89, // 95% of screen width (responsive)
          maxWidth: 1225, // cap at 1225
        },
      ]}
    >
      <View style={[styles.card, isSmallScreen ? styles.cardSmall : styles.cardLarge]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>Temperature</Text>
          <LucideThermometer size={16} color="#E53935" />
        </View>
        <Text style={styles.cardValue}>{selectedDevice.temperature}°C</Text>
        <Text style={styles.cardSubtext}>Normal range: 18-25°C</Text>
      </View>

      <View style={[styles.card, isSmallScreen ? styles.cardSmall : styles.cardLarge]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>Humidity</Text>
         <LucideDroplets size={16} color="#64B5F6" />
        </View>
        <Text style={styles.cardValue}>{selectedDevice.humidity}%</Text>
        <Text style={styles.cardSubtext}>Normal range: 40-70%</Text>
      </View>

      <View style={[styles.card, isSmallScreen ? styles.cardSmall : styles.cardLarge]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>Status</Text>
          <MaterialCommunityIcons name="pulse" size={28} color="#72dda4ff" />
        </View>
        <Text style={[styles.cardValue, styles.statusActive]}>{selectedDevice.status}</Text>
        <Text style={styles.cardSubtext}>
  Last update:{" "}
  {new Date(selectedDevice.lastUpdate).toLocaleString("en-US", {
    year: "numeric",
    month: "short",   // Jan, Feb, Mar...
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,     // ensures AM/PM format
  })}
</Text>
      </View>

      <View style={[styles.card, isSmallScreen ? styles.cardSmall : styles.cardLarge]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>Location</Text>
          <MaterialCommunityIcons name="map-marker-outline" size={20} color="#666" />
        </View>
        <Text style={[styles.cardValue, styles.locationName]}>
          {selectedDevice.location.address}
        </Text>
        <Text style={styles.cardSubtext}>
          {selectedDevice.location.lat}, {selectedDevice.location.lng}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noDeviceText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 0,
  },
  cardsContainer: {
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginRight : 0,
    marginVertical: 0,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 16,
    // marginVertical: 2,
    shadowColor: '#000',
    // shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
    marginBottom : 20,

  },
  cardSmall: {
    width: '100%',
  },
  cardLarge: {
    width: '23%',
     // 4 cards in a row with some spacing
     height : '90%'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
    alignItems: 'center',
  },
  cardHeaderText: {
    fontWeight: '400',
    fontSize: 16,
    color: '#222',
  },
  cardValue: {
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 2,
    color: '#111',
  },
  cardSubtext: {
    color: '#666',
    fontSize: 13,
  },
  statusActive: {
    backgroundColor : "#1E66F9",
    color : "#ffff",
    paddingHorizontal: 4,
    paddingLeft : 8,
    paddingBottom:4,
    paddingVertical : 3,
   
    width : 60,
    borderRadius : 10,
    marginBottom : 8,
    fontWeight : '600',
    fontSize: 12,

  },
  locationName: {
    fontWeight: '600',
    fontSize : 17
  },
});
