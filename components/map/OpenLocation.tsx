import { RootState } from "../../redux/store"
import { MapPin, Navigation } from "lucide-react-native";
import React from "react";
import {
    Linking,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSelector } from "react-redux";

const LocationCard: React.FC = () => {
  const location = useSelector(
    (state: RootState) => state.devices.selectedDevice?.location
  );

  if (!location) {
    return (
      <View style={styles.card}>
        <Text style={styles.noData}>No location data available</Text>
      </View>
    );
  }

  const handleOpenMap = () => {
    if (!location.lat || !location.lng) return;

    const latLng = `${location.lat},${location.lng}`;

    if (Platform.OS === "web") {
      window.open(`https://www.google.com/maps?q=${latLng}`, "_blank");
    } else {
      const scheme = Platform.OS === "ios" ? "maps:" : "geo:";
      const url =
        Platform.OS === "ios"
          ? `maps:0,0?q=${latLng}`
          : `geo:0,0?q=${latLng}`;

      Linking.openURL(url).catch(() => {
        Linking.openURL(`https://www.google.com/maps?q=${latLng}`);
      });
    }
  };

  return (
    <View style={styles.card}>
      {/* Address Row */}
      <View style={styles.row}>
        <MapPin color="#007AFF" size={22} style={{ marginRight: 6 }} />
        <Text style={styles.address} numberOfLines={2}>
          {location.address || "Unknown address"}
        </Text>
      </View>

      {/* Lat/Lng */}
      <Text style={styles.coords}>
        Lat: {location.lat?.toFixed(6)} | Lng: {location.lng?.toFixed(6)}
      </Text>

      {/* Button */}
      <Pressable style={styles.button} onPress={handleOpenMap}>
        <Navigation color="white" size={18} />
        <Text style={styles.buttonText}>Locate on Map</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginVertical: 8,
    width: "100%",
    maxWidth: 500, // Keeps it neat on web
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  address: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flexShrink: 1,
  },
  coords: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 6,
  },
  noData: {
    textAlign: "center",
    color: "#999",
  },
});

export default LocationCard;
