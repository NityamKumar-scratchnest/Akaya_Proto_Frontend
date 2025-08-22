import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LoadButtons({
  onNext,
  onPrev,
  loading,
  hasNext,
  hasPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
  loading: boolean;
  hasNext: boolean;
  hasPrev: boolean;
}) {
  return (
    <View style={styles.container}>
      {/* Previous Button */}
      <TouchableOpacity
        style={[styles.button, !hasPrev && styles.buttonDisabled]} // Apply disabled style if no previous
        onPress={onPrev}
        disabled={loading || !hasPrev} // Disable if loading or no previous page
      >
        {loading && !hasPrev ? <ActivityIndicator color="#000" /> : <Text style={styles.text}>Prev</Text>}
      </TouchableOpacity>

      {/* Next Button */}
      <TouchableOpacity
        style={[styles.button, !hasNext && styles.buttonDisabled]} // Apply disabled style if no next
        onPress={onNext}
        disabled={loading || !hasNext} // Disable if loading or no next page
      >
        {loading && !hasNext ? <ActivityIndicator color="#000" /> : <Text style={styles.text}>Next</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // ✨ Key change: Ensure buttons are arranged horizontally
    justifyContent: "center",
    // Removed marginHorizontal as parent will control spacing
  },
  button: {
    backgroundColor: "#F5F5F5", // Changed to gray-100
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5, // Keep some spacing between buttons
    borderWidth: 1, // Add a subtle border
    borderColor: '#E0E0E0', // Light gray border
  },
  buttonDisabled: {
    opacity: 0.5, // Make disabled buttons look faded
    backgroundColor: '#F9F9F9', // Slightly lighter background when disabled
  },
  text: {
    color: "#333", // Changed text color for better contrast
    fontSize: 14,
    fontWeight: "400",
  },
});
