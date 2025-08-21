// DeviceControls.tsx
import React, { useState } from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface DeviceControlsProps {}

const DeviceControls: React.FC<DeviceControlsProps> = () => {
  const [firmware, setFirmware] = useState<boolean>(true);
  const [connectivity, setConnectivity] = useState<boolean>(true);
  const [alerts, setAlerts] = useState<boolean>(true);

  const router = useRouter();

  const renderRow = (
    label: string,
    description: string,
    value: boolean,
    onChange: (value: boolean) => void
  ) => (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        thumbColor={"#fff"}
        trackColor={{ true: "#2563eb", false: "#d1d5db" }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="settings-outline" size={20} color="#000" />
        <Text style={styles.headerText}> Device Controls</Text>
      </View>

      {renderRow(
        "Firmware Updates",
        "Enable automatic firmware updates",
        firmware,
        setFirmware
      )}
      <View style={styles.separator} />
      {renderRow(
        "Connectivity Tests",
        "Enable periodic connectivity tests",
        connectivity,
        setConnectivity
      )}
      <View style={styles.separator} />
      {renderRow(
        "Alert Notifications",
        "Receive alerts for threshold violations",
        alerts,
        setAlerts
      )}
      <View style={styles.separator} />

      {/* Logs Row */}
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>User Logs</Text>
          <Text style={styles.description}>View detailed user activity logs</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/logs")}>
          <Ionicons name="list-outline" size={24} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeviceControls;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    margin: 0,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
  },
  description: {
    fontSize: 12,
    color: "#555",
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
  },
});
