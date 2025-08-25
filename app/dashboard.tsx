// src/screens/Dashboard.tsx
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import AddDeviceModal from "../components/AddDeviceModal";
import DeviceGrid from "../components/DeviceGrid";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { fetchDevices } from "../redux/slices/devicesSlice";
import { AppDispatch, RootState } from "../redux/store";

// system-wide spacing scale
const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export default function Dashboard() {
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();

  const accessToken = useSelector(
    (state: RootState) => state.auth.accessToken
  );

  useEffect(() => {
    dispatch(fetchDevices({ accessToken, limit: 30, search: "Boxes" }));
  }, [dispatch]);

  const isLargeScreen = width >= 768;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Navbar />

      {/* Header Row */}
      <View style={styles.headerWrapper}>
        <View style={[styles.headerRow , { paddingHorizontal : isLargeScreen ? 110 : 2} ]}>
          <View>
            <Text
              style={[
                styles.header,
                { fontSize: isLargeScreen ? 26 : 22 },
              ]}
            >
              Device Dashboard
            </Text>
            <Text
              style={[
                styles.sub,
                { fontSize: isLargeScreen ? 16 : 12 },
              ]}
            >
              Manage your smart boxes
            </Text>
          </View>

          <Pressable
            style={[
              styles.button,
              {
                paddingHorizontal: isLargeScreen ? spacing.sm : spacing.sm,
                paddingVertical: isLargeScreen ? 10 : 8,
                marginRight : isLargeScreen ? 10 : 0,
              },
            ]}
            onPress={() => setModalVisible(true)}
          >
            <Plus stroke="#fff" fill="#fff" size={16} />
            <Text style={styles.btnText}>Add Device</Text>
          </Pressable>
        </View>

        <SearchBar />
      </View>

      {/* Scrollable Device Grid */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingHorizontal: isLargeScreen ? spacing.lg : spacing.md,
            paddingVertical: isLargeScreen ? spacing.lg : spacing.md,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <DeviceGrid />
      </ScrollView>

      {/* Add Device Modal */}
      <AddDeviceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
  headerWrapper: {
    backgroundColor: "#fff",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  header: {
    fontWeight: "700",
    color: "#212529",
  },
  sub: {
    color: "#666",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    gap: 6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
    marginLeft: 4,
  },
});
