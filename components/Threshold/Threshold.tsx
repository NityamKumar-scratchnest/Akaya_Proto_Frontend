import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import TemperatureThreshold from "./TemperatureThreshold";
import HumidityThreshold from "./HumidityThreshold";
import DeviceControls from "./DeviceControls";
import DeviceActions from "./DeviceActions";



export default function Threshold() {
  return (
    <ScrollView style={styles.container}>
      <TemperatureThreshold />
      <HumidityThreshold />
      <DeviceControls/>
      <DeviceActions/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 0,
  },
});
