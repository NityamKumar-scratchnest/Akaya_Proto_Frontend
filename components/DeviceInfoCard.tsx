import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { toggleDeviceLock } from '../redux/slices/devicesSlice';

const showMessage = (title: string, message: string) => {
  console.log(title, message);
};

interface Device {
  id: string;
  isLocked: boolean;
  status: string;
  batteryLevel: number;
  model: string;
  firmwareVersion: string;
}

interface DeviceInfoCardsProps {
  device: Device;
}

export default function DeviceInfoCards({ device }: DeviceInfoCardsProps) {
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [locked, setLocked] = useState(device.isLocked);

  const isLargeScreen = width >= 768;

  const handlePasswordSubmit = () => {
    if (password === '1234') {
      dispatch(toggleDeviceLock(device.id));
      setLocked(!locked);
      setModalVisible(false);
      setPassword('');
      showMessage('Success', `Device has been ${locked ? 'Unlocked' : 'Locked'}`);
    } else {
      showMessage('Error', 'Incorrect password.');
    }
  };
  const modalWidth = width > 600 ? '70%' : '90%';
  // Small screen card with all info in key-value rows
  if (!isLargeScreen) {
    return (
      <View style={styles.smallContainer}>
<View style={styles.smallCard}>
        <View style={styles.kvRow}>
          <Text style={styles.label}>Status</Text>
          <Text
            style={[
              styles.valueText,
              { color: device.status === 'Active' ? '#ffffffff' : '#dc3545' , backgroundColor : "#1E66F9" , paddingHorizontal: 15, padding: 2},
            ]}
          >
            {device.status}
          </Text>
        </View>

        <View style={styles.kvRow}>
          <Text style={styles.label}>Lock Status</Text>
          <TouchableOpacity
    onPress={() => setModalVisible(true)}
    style={[
      styles.buttonTouchable,
      {
        flexDirection: "row", // icon + text inline
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8,
        borderColor: "#ccc",
        borderWidth: 1,
        backgroundColor: "#fff",
      },
    ]}
  >
    {/* Example icon */}
    <MaterialCommunityIcons
      name={locked ? "lock-outline" : "lock-open-variant-outline"}
      size={18}
      color={locked ? "#E53935" : "#43A047"}
      style={{ marginRight: 6}}
    />

    <Text
      style={{
        fontSize: 14,
        fontWeight: "500",
        color: locked ? "#E53935" : "#43A047",
      }}
    >
      {locked ? "Locked" : "Unlocked"}
    </Text>
  </TouchableOpacity>
        </View>

        <View style={styles.kvRow}>
  <Text style={styles.label}>Battery</Text>
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <MaterialCommunityIcons name="battery-outline" size={20} color="black" />
    <Text style={[styles.valueText, { marginLeft: 6 }]}>
      {device.batteryLevel}%
    </Text>
  </View>
</View>


        <View style={styles.kvRow}>
          <Text style={styles.label}>Model</Text>
          <Text style={styles.valueText}>
            {device.model} (v{device.firmwareVersion})
          </Text>
        </View>

        {/* Modal for lock/unlock */}
         <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { width: modalWidth }]}>
          <Text style={styles.modalTitle}>Enter Password</Text>
          <Text style={styles.modalText}>
            To {locked ? 'unlock' : 'lock'} the device, enter the password 1234.
          </Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            onChangeText={setPassword}
            value={password}
            placeholder="••••••••"
            placeholderTextColor="#999"
          />
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.buttonCancel]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.buttonOk]}
              onPress={handlePasswordSubmit}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
      </View>

      </View>
    );
  }

  // Original large screen layout
  interface InfoBoxProps {
    title: string;
    children: React.ReactNode;
    style?: object;
  }

  const InfoBox = ({ title, children, style = {} }: InfoBoxProps) => (
    <View style={[styles.card, style]}>
      <View style={styles.keyValueRow}>
        <Text style={styles.label}>{title}</Text>
        {children}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.row]}>
        <InfoBox title="Status ">
          <Text
            style={[
              styles.valueText,
              { color: device.status === 'Active' ? '#ffffffff' : '#dc3545', marginTop : 8  ,backgroundColor:'#2563eb'  , paddingHorizontal : 8, paddingVertical : 2 ,},
            ]}
          >
            {device.status}
          </Text>
        </InfoBox>

        <InfoBox title="Lock Status">
  <TouchableOpacity
    onPress={() => setModalVisible(true)}
    style={[
      styles.buttonTouchable,
      {
        flexDirection: "row", // icon + text inline
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderColor: "#ccc",
        borderWidth: 1,
        backgroundColor: "#fff",
      },
    ]}
  >
    {/* Example icon */}
    <MaterialCommunityIcons
      name={locked ? "lock-outline" : "lock-open-variant-outline"}
      size={18}
      color={locked ? "#E53935" : "#43A047"}
      style={{ marginRight: 6 }}
    />

    <Text
      style={{
        fontSize: 14,
        fontWeight: "500",
        color: locked ? "#E53935" : "#43A047",
      }}
    >
      {locked ? "Locked" : "Unlocked"}
    </Text>
  </TouchableOpacity>
</InfoBox>



        <InfoBox title="Battery">
  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
    <MaterialCommunityIcons name="battery-outline" size={20} color="black" />
    <Text style={[styles.valueText, { marginLeft: 6 }]}>
      {device.batteryLevel}%
    </Text>
  </View>
</InfoBox>

        {/* // it takes tieme to center the alignment it is not the way we can write the code in the better practive there are css overlapping maintain that */}
        <InfoBox title="Model" style={{ paddingTop: 15 }}>
  <View style={{ alignItems: "flex-end" }}>
    {/* Device Model */}
    <Text style={[styles.valueText, { fontSize: 14 }]}>
      {device.model}
    </Text>

    {/* Firmware Version */}
    <Text style={{ fontSize: 12, fontWeight: "300", color: "#666" }}>
      v{device.firmwareVersion}
    </Text>
  </View>
</InfoBox>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Enter Password</Text>
            <Text style={styles.modalText}>
              To {locked ? 'unlock' : 'lock'} the device, enter the password.
            </Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              onChangeText={setPassword}
              value={password}
              placeholder="••••••••"
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonOk]}
                onPress={handlePasswordSubmit}
              >
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingLeft : 160,
    paddingHorizontal : 140,
    flex: 1,
    backgroundColor : "#ffffff",
    paddingVertical : 24,
    // boxShadow: "0px 12px 24px rgba(0,0,0,0.15)",
    zIndex : 1

   
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffffff',
    borderRadius: 6,
    padding: 16,
    minWidth: 160,
    flex: 1,
    elevation: 3,
    shadowColor: '#000000ff',
    shadowOpacity: 0.2,
    borderStyle : 'solid',
    borderColor : "#000",
    // shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    width: windowWidth < 400 ? '100%' : windowWidth * 0.4,
  },
  keyValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
    
  },
  valueText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#212529',
    
    borderRadius : 20,
  },
  smallContainer:{
    height : 220,
    backgroundColor : "#ffffff",
    paddingLeft : 10,
   paddingRight : 7,
   paddingBottom : 8,
   boxShadow : "0px 4px 10px rgba(0,0,0,0.15)"
  },
  smallCard: {
    flex: 1,
    gap : 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    paddingHorizontal:20 ,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
    // margin : 10,
    height : 200
  },
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
    // width: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#6c757d',
  },
  buttonOk: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonTouchable:{
    padding : 5,
    borderColor : "#0000"
  }
});
