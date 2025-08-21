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
      {hasPrev && (
        <TouchableOpacity style={styles.button} onPress={onPrev} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>Prev</Text>}
        </TouchableOpacity>
      )}

      {hasNext && (
        <TouchableOpacity style={styles.button} onPress={onNext} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>Next</Text>}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    marginHorizontal: 100,
  },
  button: {
    backgroundColor: "#1E66F9",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "400",
  },
});
