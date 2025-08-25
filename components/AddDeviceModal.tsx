// components/AddDeviceModal.tsx
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { addDevice } from '../redux/slices/devicesSlice';
import type { AppDispatch } from '../redux/store';


// Import the Picker component
// import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function AddDeviceModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
  const [name, setName] = useState('');
  const accessToken = useSelector ((state : RootState)=>state.auth.accessToken)
  // Set the default model to one of the dropdown options
  const [model, setModel] = useState('Smart Box (Hot)');
  const [location, setLocation] = useState('Greater Noida');
  const dispatch = useDispatch<AppDispatch>();
  // const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  // Use a more standard breakpoint for large screens
  const isLargeScreen = width >= 768;

  const handleAdd = () => {
    if (!name.trim()) {
      alert('Please enter a device name.');
      return;
    }
    dispatch(addDevice({
      accessToken: accessToken,
      deviceData: {
        name,
        model,
        location: { lat: 28.5768906319082, lng: 77.4858652315803, address: location },
        status: 'Active',
        isLocked: false,
        temperature: 22,
        humidity: 60,
        batteryLevel: 90,
        firmwareVersion: '1.0',
        lastUpdate: new Date().toISOString(),
      }
    }));
    onClose();
  };

  // Dynamic styles for responsiveness
  const styles = getStyles(isLargeScreen);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      {/* The overlay now centers its content */}
      <View style={styles.overlay}>
        {/* The modal view itself has responsive styling */}
        <View style={styles.modal}>
          <Text style={styles.title}>Add New Device</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Device Name"
            style={styles.input}
          />

          {/* This View wraps the Picker to give it a consistent border style */}
          <View style={styles.pickerContainer}>
            {/* <Picker
              selectedValue={model}
              onValueChange={(itemValue) => setModel(itemValue)}
              style={styles.picker}
              // Dropdown prompt for Android
              prompt="Select a model"
            >
              <Picker.Item label="Smart Box (Hot)" value="Smart Box (Hot)" />
              <Picker.Item label="Smart Box (Cold)" value="Smart Box (Cold)" />
            </Picker> */}
          </View>

          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Location"
            style={styles.input}
          />

          <Pressable style={styles.button} onPress={handleAdd}>
            <Text style={styles.buttonText}>Add Device</Text>
          </Pressable>
          <Pressable onPress={onClose}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// Use a function to generate styles based on screen size
const getStyles = (isLargeScreen: boolean) => StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Horizontally center the modal
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal: {
    width: isLargeScreen ? 400 : '90%', // Set a max width on large screens
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  // Container for the Picker to give it a border
  pickerContainer: {
  height: 45,
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 8,
  marginBottom: 15,
  backgroundColor: '#f9f9f9',
  justifyContent: 'center', // vertically center text
  
},

picker: {
  width: '100%',
  height: '100%', // make picker take full height
  color: '#333', // text color to match TextInput
  ...Platform.select({
    web: {
      // outline: 'none',
      borderWidth: 0,   // remove browser default borders
      backgroundColor: 'transparent',
    },
    android: {
      backgroundColor: 'transparent',
    },
    ios: {
      backgroundColor: 'transparent',
    },
  }),
},

  button: {
    backgroundColor: '#1E66F9',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center', // Ensure text is centered
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancel: {
    textAlign: 'center',
    color: '#666',
    marginTop: 15,
    padding: 5,
  }
});
