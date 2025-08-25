import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '../redux/store';
// Ensure this path is absolutely correct and the file exists at this location.
import { fetchDevices, } from '../redux/slices/devicesSlice';
import type { AppDispatch } from '../redux/store';
import { refreshAccessToken } from '../services/authApi';
import { setAccessToken } from '../redux/slices/authSlice';

// Create a new component to house the Redux logic
function AppContent() {
  const dispatch = useDispatch<AppDispatch>();

 useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const state = store.getState().auth;
      if (state.refreshToken) {
        console.log("⏳ Trying proactive refresh...");
        const { accessToken: newToken } = await refreshAccessToken(state.refreshToken);
        store.dispatch(setAccessToken(newToken));
        console.log("✅ Token refreshed proactively");
      }
    } catch (err) {
      console.error("Proactive refresh failed", err);
    }
  }, 10 * 60 * 1000); // every 10 minutes

  return () => clearInterval(interval);
}, []);
 // Dependency array includes dispatch

  // Render the rest of your app's content here
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
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