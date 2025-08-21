// components/DeviceActions.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DeviceActionsProps {
  onUpdateFirmware?: () => void;
  onTestConnectivity?: () => void;
}

const DeviceActions: React.FC<DeviceActionsProps> = ({
  onUpdateFirmware,
  onTestConnectivity,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Device Actions</Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.button} onPress={onUpdateFirmware}>
          <Ionicons name="download-outline" size={16} color="#000" />
          <Text style={styles.buttonText}> Update Firmware</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onTestConnectivity}>
          <Ionicons name="wifi-outline" size={16} color="#000" />
          <Text style={styles.buttonText}> Test Connectivity</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeviceActions;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
