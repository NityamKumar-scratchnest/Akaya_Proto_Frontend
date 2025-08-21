import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { LucideThermometer } from "lucide-react-native";
import { useWindowDimensions } from "react-native";
export default function TemperatureThreshold() {
  const [minTemp, setMinTemp] = useState("");
  const [maxTemp, setMaxTemp] = useState("");
  const {width} = useWindowDimensions()
  const isLargeScreen = width > 400;
  const handleSave = () => {
    Alert.alert("Threshold Saved", "Temperature thresholds have been saved.");
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <LucideThermometer size={20} color="#E53935" />
        <Text style={styles.title}>Temperature Thresholds</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Minimum Temperature (°C)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={minTemp}
            onChangeText={setMinTemp}
            placeholder="e.g. 18"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Maximum Temperature (°C)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={maxTemp}
            onChangeText={setMaxTemp}
            placeholder="e.g. 25"
          />
        </View>
      </View>

      <TouchableOpacity style={[styles.button , {width : isLargeScreen ? 200 : 150}] } onPress={handleSave}>
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
    marginBlock : 10
    // No border or shadow to remove container border effect
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight :"500",
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
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    marginTop : 10
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
