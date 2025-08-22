import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react'; // Import useState
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSelector } from 'react-redux';
import BoxNavbar from '../../components/BoxNavbar';
import DeviceInfoCards from '../../components/DeviceInfoCard'; // Corrected import path for DeviceInfoCards
import TabNavigation from '../../components/TabNavigator'; // Import the TabNavigation component
import { RootState } from '../../redux/store';

export default function DeviceDetailScreen() {
  const { id } = useLocalSearchParams();
  const deviceId = typeof id === 'string' ? id : id?.[0];
 const { width } = useWindowDimensions();

  const isLargeScreen = width >= 768; 
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState('Overview'); 

  const device = useSelector((state: RootState) =>
    state.devices.devices.find((d) => d.id === deviceId)
  );

  if (!device) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Device not found.</Text>
      </View>
    );
  }

  return (

   
    <View style={[styles.container , ]}>
      <BoxNavbar title={device.name} />
      <View style={[styles.shadowBottomContainer ,{paddingVertical : 0}]}>
      <DeviceInfoCards device={device} />
      </View>
      
      <ScrollView contentContainerStyle={[styles.content ,{paddingHorizontal : isLargeScreen ? 120 : 0 }]}>
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} device={device} />       
      </ScrollView>
      
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   

   
  },
  shadowBottomContainer:{
   
    
    //  paddingBottom : 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 5,

    // These properties control the stacking order
    elevation: 5, // For Android shadow and stacking
    zIndex: 1,
  },
  notFound: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
  content: {
    padding: 0,
  },
  section: {
    marginTop: 20,
     
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#444',
  },
  sectionValue: {
    fontSize: 14,
    color: '#666',
  },
  tabContent: {
    marginTop: 20, // Add some spacing between tabs and content
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
});