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
import { useDispatch, useSelector } from "react-redux";
import AddDeviceModal from "../components/AddDeviceModal";
import LoadButtons from "../components/dashboard/LoadMoreButton";
import DeviceGrid from "../components/DeviceGrid";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { fetchDevices } from "../redux/slices/devicesSlice";
import { AppDispatch, RootState } from "../redux/store";
import Footer from "../components/Footer";
export default function Dashboard() {
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = useWindowDimensions();

  const dispatch = useDispatch<AppDispatch>();
  const { devices, loading, nextCursor, prevCursor } = useSelector(
    (state: RootState) => state.devices
  );
  const accessToken = useSelector( (state : RootState) => state.auth.accessToken )
  console.log(accessToken)

  // Replace this with your actual token (from auth state or secure store)
  // const accessToken = "YOUR_ACCESS_TOKEN";

  // Initial load
  useEffect(() => {
    dispatch(fetchDevices({ accessToken, limit: 30, search: "Boxes" }));
  }, [dispatch]);

  const isLargeScreen = width >= 768;

  return (
    <View style={styles.container}>
      <Navbar />

      {/* Header Row */}
      <View style={styles.styleOnFirst}>
      <View
        style={[
          styles.headerRow,
          {
            paddingHorizontal: isLargeScreen ? 35 : 10,
            paddingTop: isLargeScreen ? 20 : 5,
          },
        ]}
      >
        <View style={{ paddingLeft: isLargeScreen ? 10 : 5 }}>
          <Text
            style={[
              styles.header,
              {
                fontSize: isLargeScreen ? 26 : 22,
                paddingHorizontal: isLargeScreen ? 90 : 3,
                paddingTop: 12,
              },
            ]}
          >
            Device Dashboard
          </Text>
          <Text
            style={[
              styles.sub,
              {
                fontSize: isLargeScreen ? 16 : 12,
                paddingHorizontal: isLargeScreen ? 90 : 3,
                paddingTop : 4
              },
            ]}
          >
            Manage your smart boxes
          </Text>
        </View>
        <Pressable
          style={[
            styles.button,
            {
              marginHorizontal: isLargeScreen ? 102 : 0,
              paddingHorizontal: isLargeScreen ? 18 : 6,
              paddingVertical: isLargeScreen ? 9 : 8,
              marginRight : isLargeScreen ? 110 : 10 ,
            },
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Plus stroke="#fff" fill="#fff" size={16}/>
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
            paddingHorizontal: isLargeScreen ? 38 : 0,
            paddingVertical: isLargeScreen ? 30 : 15,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <DeviceGrid />

        {/* Pagination buttons */}
        <LoadButtons
          onNext={() =>
            dispatch(fetchDevices({ accessToken, cursor: nextCursor }))
          }
          onPrev={() =>
            dispatch(fetchDevices({ accessToken, prevCursor }))
          }
          loading={loading}
          hasNext={!!nextCursor}
          hasPrev={!!prevCursor}
        />

        
      </ScrollView>
      

      {/* Add Device Modal */}
      <AddDeviceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      {/* <ScrollView>
        <Footer/>
      </ScrollView> */}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    
  },
  header: {
    fontWeight: "700",
    fontSize: 0,
    color : "#212529"
    // fontFamily: "mono",
  },
  sub: {
    color: "#666",
  },
  button: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    gap: 2,
  },
  styleOnFirst:{
    backgroundColor : '#fff',
    
    paddingBottom : 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 5,

    // These properties control the stacking order
    elevation: 5, // For Android shadow and stacking
    zIndex: 1,
  },
  btnText: {
    color: "#fff",
    fontWeight: "500",
    fontSize : 16,
    marginLeft: 4,
  },
});
