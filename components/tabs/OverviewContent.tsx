import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import DeviceInfoTabs from '../DeviceInfoTabs';
import TempHumidityChartGifted from '../graphs/OverViewGraph';
import OpenLocationButton from '../map/OpenLocation';

function OverviewContent() {
  const selectedDevice = useSelector((state: RootState) => state.devices.selectedDevice);

  if (!selectedDevice) {
    return (
      <View style={styles.centeredMessage}>
        <Text style={styles.messageText}>No device selected to display overview.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* <MapLibreView /> */}
      <DeviceInfoTabs/>
      <OpenLocationButton/>
      {/* Just pass deviceId, no sensor logs */}
      <TempHumidityChartGifted deviceId={selectedDevice.id} />

      {/* Other details */}
      {/* <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.sectionValue}>{selectedDevice.location.address}</Text>

        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Last Update</Text>
        <Text style={styles.sectionValue}>{selectedDevice.lastUpdate}</Text>
      </View> */}
    </ScrollView>
  );
}

export default OverviewContent;

const styles = StyleSheet.create({
  container: { flex: 1, padding:0 , paddingLeft : 7 },
  centeredMessage: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  messageText: { fontSize: 16, color: '#666', textAlign: 'center' },
  detailsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#444' },
  sectionValue: { fontSize: 14, color: '#666' },
});
