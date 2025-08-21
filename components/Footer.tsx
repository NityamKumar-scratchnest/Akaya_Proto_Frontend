import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        © {new Date().getFullYear()} Akaya. All rights reserved.
      </Text>
      {/* <Text
        style={styles.link}
        onPress={() => Linking.openURL('https://mywebsite.com')}
      >
        Visit Website
      </Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffffff',
    paddingVertical: 12,
    
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#444',
    width: '100%',
  },
  text: {
    color: '#bbb',
    fontSize: 14,
    marginBottom: 4,
  },
  link: {
    color: '#4dabf7',
    fontSize: 14,
    textDecorationLine: Platform.OS === 'web' ? 'none' : 'none',
  },
});
