// components/SplashScreen.tsx
import React, { useEffect } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000); // show splash for 2 seconds
    return () => clearTimeout(timer);
  }, []);
  

  return (
    <View style={styles.container}>
      <Image
        source={
          Platform.OS === "web"
            ? require("../assets/web-logo.png")
            : require("../assets/mobile-logo.png")
        }
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>My Custom App</Text>
      <Text style={styles.subtitle}>
        {Platform.OS === "web" ? "Welcome Web User!" : "Hello Mobile User!"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#aaa",
    fontSize: 16,
    marginTop: 5,
  },
});
