// DeviceGrid.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LucideDroplets, LucideThermometer } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { Device } from '../redux/slices/devicesSlice';
import { fetchDevices, setSelectedDevice } from '../redux/slices/devicesSlice';
import { AppDispatch, RootState } from '../redux/store';
import LoadButtons from './dashboard/LoadMoreButton'; // Import LoadButtons

const ITEMS_PER_PAGE = 20;

const DeviceCard = ({ device }: { device: Device }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isInactive = device.status === 'Inactive';
  const [isHovered, setIsHovered] = useState(false);
  
  const handlePress = () => {
    dispatch(setSelectedDevice(device.id));
    router.push(`/device/${device.id}`);
  };

  const {width} = useWindowDimensions();
  const isSmallScreen = width < 700;

  const formatLastUpdate = (isoString: string) => {
    if (!isoString) return 'No data';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      onHoverIn={() => Platform.OS === 'web' && setIsHovered(true)}
      onHoverOut={() => Platform.OS === 'web' && setIsHovered(false)}
      style={[
        styles.card,
        isInactive && styles.inactiveCard,
        isHovered && Platform.OS === 'web' ? styles.hover : null,
        { elevation: isSmallScreen ? 5 : 1 }
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <View
          style={[
            styles.statusBadge,
            device.status === 'Active' ? styles.activeBadge : styles.inactiveBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              device.status === 'Active' ? styles.activeStatusText : styles.inactiveStatusText,
            ]}
          >
            {device.status}
          </Text>
        </View>
      </View>

      <Text style={styles.deviceType}>{device.model}</Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons
            name={device.isLocked ? 'lock-outline' : 'lock-open-variant-outline'}
            size={20}
            color={device.isLocked ? '#E53935' : '#43A047'}
          />
          <Text style={styles.infoText}>{device.isLocked ? 'Locked' : 'Unlocked'}</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons name="battery-outline" size={20} color="black" />
          <Text style={styles.infoText}>{device.batteryLevel}%</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <LucideThermometer size={20} color="#E53935" />
          <Text style={styles.infoText}>{device.temperature}°C</Text>
        </View>
        <View style={styles.infoItem}>
          <LucideDroplets size={20} color="#64B5F6" />
          <Text style={styles.infoText}>{device.humidity}%</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>
          Last update: {formatLastUpdate(device.lastUpdate)}
        </Text>
      </View>
    </Pressable>
  );
};

export default function DeviceGrid() {
  const dispatch = useDispatch<AppDispatch>();

  const { devices, loading, error, currentPage, totalPages, totalRecords } = useSelector(
    (state: RootState) => state.devices
  );
  const accessToken = useSelector((state: RootState) => state?.auth?.accessToken || null);

  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const isSmallScreen = width < 768;

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchDevices({ accessToken, page: currentPage, limit: ITEMS_PER_PAGE }));
    }
  }, [dispatch, accessToken, currentPage]);

  const handleNextPage = () => {
    if (!loading && currentPage < totalPages) {
      dispatch(fetchDevices({ accessToken: accessToken!, page: currentPage + 1, limit: ITEMS_PER_PAGE }));
    }
  };

  const handlePrevPage = () => {
    if (!loading && currentPage > 1) {
      dispatch(fetchDevices({ accessToken: accessToken!, page: currentPage - 1, limit: ITEMS_PER_PAGE }));
    }
  };

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const startIndex = totalRecords > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endIndex = Math.min(startIndex + devices.length - 1, totalRecords);

  if (loading && devices.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1E66F9" />
        <Text style={styles.loadingText}>Loading devices...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (devices.length === 0 && !loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noDevicesText}>No devices found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLargeScreen ? (
        <View style={[styles.grid, { paddingHorizontal: 94, paddingRight: 100 }]}>
          {devices.map(device => (
            <View key={device.id} style={[styles.gridItem, { padding: isLargeScreen ? 6 : 6 }]}>
              <DeviceCard device={device} />
            </View>
          ))}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {devices.map(device => (
            <View key={device.id} style={styles.item}>
              <DeviceCard device={device} />
            </View>
          ))}
        </ScrollView>
      )}

      {/* Pagination Controls Section */}
      {/* Apply small screen specific styles to paginationContainer */}
      <View style={[styles.paginationContainer, isSmallScreen && styles.paginationContainerSmall]}>
        {/* "Showing X to Y of Z entries" - Always at the top on small screens */}
        <Text style={[styles.paginationText, isSmallScreen && styles.paginationTextSmallScreen]}>
          Showing {startIndex} to {endIndex} of {totalRecords} entries
        </Text>

        {/* This View holds "Page A of B" and the buttons */}
        <View style={[styles.paginationControlsRow, isSmallScreen && styles.paginationControlsRowSmall]}>
          {/* Page A of B */}
          <Text style={styles.paginationPageInfo}>
            Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
          </Text>

          {/* Previous/Next Buttons using your LoadButtons component */}
          {/* Moved LoadButtons to be adjacent to Page Info */}
          <LoadButtons
            onNext={handleNextPage}
            onPrev={handlePrevPage}
            loading={loading}
            hasNext={hasNextPage}
            hasPrev={hasPrevPage}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  noDevicesText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 16,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  item: {
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 0,
    marginHorizontal: 0,
    paddingHorizontal: 10,
  },
  gridItem: {
    width: '33.33%',
    padding: 6,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    paddingBottom: 25,
    borderColor: '#E0E0E0'
  },
  inactiveCard: {
    backgroundColor: '#FAFAFA',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  activeBadge: {
    backgroundColor: '#1E66F9',
    color: '#fff',
  },
  inactiveBadge: {
    backgroundColor: '#ed3d3dff',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeStatusText: {
    color: '#f1f4f7ff',
  },
  inactiveStatusText: {
    color: '#fffdfdff',
  },
  deviceType: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
  hover: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 0,
    ...(Platform.OS === 'web' && {
      transition: 'all 0.3s ease',
    }),
  },
  // --- Pagination Styles ---
  paginationContainer: {
    flexDirection: 'row', // Default for large screens
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    paddingHorizontal: 105,
    flexWrap: 'wrap',
  },
  // Small screen specific styles for the main pagination container
  paginationContainerSmall: {
    flexDirection: 'column', // Stack children vertically
    alignItems: "center", // Center items horizontally when stacked
    paddingHorizontal: 0,
    justifyContent: 'space-between',
  },
  paginationText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'left', // Default left alignment
    flex: 1,
    paddingRight: 10,
  },
  // Small screen specific style for the "Showing X to Y" text
  paginationTextSmallScreen: {
    width: '100%', // Take full width
    textAlign: 'center', // Center the text horizontally
    marginBottom: 10, // Add space below it
    paddingRight: 0, // Remove right padding
  },
  paginationControlsRow: {
    flexDirection: 'row', // Default for large screens (buttons + page info in a row)
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    flexWrap: 'wrap',
    gap: 5,
  },
  // Small screen specific style for the row containing buttons and page info
  paginationControlsRowSmall: {
    flexDirection: 'row', // Keep buttons and page info in a row
    justifyContent: 'center', // Center them horizontally
    alignItems: 'center',
    width: '100%', // Take full width
    marginTop: 0, // Remove top margin as paginationTextSmallScreen adds it
  },
  paginationButton: {
    backgroundColor: '#F5F5F5', // Gray-100
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#F9F9F9',
  },
  paginationButtonText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 14,
  },
  paginationPageInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 10,
  },
});
