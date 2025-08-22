import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';

// Import the full TabularDataContent component you already created,
// which uses useSelector internally to get device and logs
 // Adjust the path as needed
 import SensorLogsTable from '../SensorLogsTable';



export default function DeviceDetailsScreen() {
    const {width} = useWindowDimensions()
const isLargeScreen = width > 720
  return (
    <ScrollView style={[styles.container , {marginLeft : isLargeScreen ? 36 : 2  , paddingRight : isLargeScreen ? 15 : 0}]}>
      
      <SensorLogsTable/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F9FAFB',
    padding: 0,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
