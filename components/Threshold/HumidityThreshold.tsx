import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import { LucideDroplets } from "lucide-react-native";
export default function HumidityThreshold() {
  const [minHumidity, setMinHumidity] = useState("");
  const [maxHumidity, setMaxHumidity] = useState("");
  const {width} = useWindowDimensions()
    const isLargeScreen = width > 400;
  const handleSave = () => {
    Alert.alert("Threshold Saved", "Humidity thresholds have been saved.");
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <LucideDroplets size={20} color="#64B5F6" />
        <Text style={styles.title}>Humidity Thresholds</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Minimum Humidity (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={minHumidity}
            onChangeText={setMinHumidity}
            placeholder="e.g. 40"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Maximum Humidity (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={maxHumidity}
            onChangeText={setMaxHumidity}
            placeholder="e.g. 70"
          />
        </View>
      </View>

      <TouchableOpacity style={[styles.button , {width : isLargeScreen ? 200 : 150}]} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Thresholds</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    // No border or shadow
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
  },
  button: {
    marginTop: 12,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 6,
    width : 200
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
