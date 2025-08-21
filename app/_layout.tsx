import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '../redux/store';
// Ensure this path is absolutely correct and the file exists at this location.
import { fetchDevices, } from '../redux/slices/devicesSlice';
import type { AppDispatch } from '../redux/store';

// Create a new component to house the Redux logic
function AppContent() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchAllData = async () => {
      // console.log('Fetching latest device and sensor log data...');
      // These calls should now correctly resolve to functions after cache clear
      dispatch(fetchDevices({} as any)); 
    };

    // Fetch data immediately when the app mounts
    fetchAllData();

    // Set up an interval to fetch data periodically (every 10 minutes)
    const intervalId = setInterval(fetchAllData, 600000); // 10 minutes = 600000 ms

    // Cleanup function: Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [dispatch]); // Dependency array includes dispatch

  // Render the rest of your app's content here
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate
       
        persistor={persistor}
      >
        {/* Render AppContent as a child of PersistGate (and thus Provider) */}
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f2f5',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#555',
//   },
// });