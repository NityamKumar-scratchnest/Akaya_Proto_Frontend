import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Threshold from '../Threshold/Threshold';
import { useWindowDimensions } from 'react-native';
function SettingsContent() {
  const {width} = useWindowDimensions()
  const isLargeScreen = width > 1024
  return (
    <View style={[styles.container , {paddingLeft : isLargeScreen ? 40 : 10 , marginBottom : 30}]}>
      <Threshold/>
    </View>
  );
}

export default SettingsContent;

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingLeft : 10
    // borderRadius: 10,
    // elevation: 3,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
