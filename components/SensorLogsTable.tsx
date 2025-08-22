import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useEffect } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSensorLogsForExport, fetchSensorLogs, SensorLog } from '../redux/slices/sensorLogsSlice';
import { AppDispatch, RootState } from '../redux/store';

// Define the interfaces for Device (SensorLog already defined in slice)
export interface Device {
  id?: string;
  _id?: string;
  deviceId?: string;
  name?: string;
  devicePayload?: string;
  serial?: string;
}

// Items per page constant
const ITEMS_PER_PAGE = 20;

/**
 * SensorLogsTable component displays a paginated table of sensor logs.
 * Data is fetched with server-side pagination.
 */
export default function SensorLogsTable() {
  const dispatch = useDispatch<AppDispatch>();

  // Select logs and pagination metadata from Redux store
  const logs = useSelector((state: RootState) => state.sensorLogs.logs);
  const loading = useSelector((state: RootState) => state.sensorLogs.loading);
  const error = useSelector((state: RootState) => state.sensorLogs.error);
  const currentPage = useSelector((state: RootState) => state.sensorLogs.currentPage);
  const totalPages = useSelector((state: RootState) => state.sensorLogs.totalPages);
  const totalRecords = useSelector((state: RootState) => state.sensorLogs.totalRecords);

  // Select the currently selected device (if any).
  // In a real app, `devicePayload` would be dynamically set from `device?.devicePayload`.
  // For this showcase, it's hardcoded as 'device-0001'.
  const device = useSelector((state: RootState) => state.devices.selectedDevice) as Device | undefined;
  const devicePayload = 'device-0001'; // Hardcoded as per requirement

  // Get window dimensions for responsive styles
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const isLargeScreen = width > 768;

  // Effect to fetch sensor logs when component mounts or current page changes
  useEffect(() => {
    // FIX: Pass devicePayload to the fetchSensorLogs thunk
    dispatch(fetchSensorLogs({ page: currentPage, limit: ITEMS_PER_PAGE }));
  }, [dispatch, currentPage, devicePayload]); // Re-fetch when page or device payload changes

  // Helper for pagination display text
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  // endIndex calculates the last item shown on the current page, based on the `logs.length` (which is the actual number of items received)
  const endIndex = startIndex + logs.length;

  // Handlers for pagination buttons
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      // Dispatch the action to fetch the next page
      dispatch(fetchSensorLogs({ page: currentPage + 1, limit: ITEMS_PER_PAGE, }));
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      // Dispatch the action to fetch the previous page
      dispatch(fetchSensorLogs({ page: currentPage - 1, limit: ITEMS_PER_PAGE }));
    }
  };

  /**
   * Handles exporting all logs to a CSV file.
   * This now makes a separate API call to fetch all data for export.
   * Supports both web and native platforms.
   */
  const exportToCSV = async () => {
    // Show loading or disable button during export fetch
    Alert.alert("Exporting Data", "Preparing all sensor logs for export. This may take a moment...", [{ text: "OK" }]);

    try {
      // Dispatch the thunk to fetch all logs for export
      // This will return the full array of logs, not paginated.
      const actionResult = await dispatch(fetchAllSensorLogsForExport({ devicePayload: devicePayload }));

      // Access the payload from the fulfilled action
      const allLogsForExport: SensorLog[] = actionResult.payload as SensorLog[];

      if (!allLogsForExport || allLogsForExport.length === 0) {
        Alert.alert('No Data', 'There is no data to export.');
        return;
      }

      const header = ['ID', 'Device ID', 'Timestamp', 'Temperature (°C)', 'Humidity (%)', 'Status'].join(',');
      const rows = allLogsForExport.map((log) => {
        const timestamp = format(new Date(log.timestamp), 'dd/MM/yyyy, hh:mm a');
        const status = log.temperature > 30 || log.humidity > 80 ? 'Abnormal' : 'Normal';
        return [
          `"${log._id ?? log.id ?? ''}"`,
          `"${log.deviceId ?? ''}"`,
          `"${timestamp}"`,
          `"${log.temperature}"`,
          `"${log.humidity}"`,
          `"${status}"`,
        ].join(',');
      });
      const csvString = `${header}\n${rows.join('\n')}`;
      const filename = `All_SensorLogs_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;

      if (Platform.OS === 'web') {
        try {
          const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          Alert.alert('Export Complete', 'CSV file downloaded successfully!');
        } catch (err) {
          console.error('Failed to export CSV on web:', err);
          Alert.alert('Export Failed', 'Could not download CSV file on web.');
        }
      } else { // Native platforms (iOS/Android)
        try {
          const canShare = await Sharing.isAvailableAsync();
          if (!canShare) {
            Alert.alert('Sharing Unavailable', 'File sharing is not supported on this device.');
            return;
          }
          const fileUri = FileSystem.cacheDirectory + filename;
          await FileSystem.writeAsStringAsync(fileUri, csvString, { encoding: FileSystem.EncodingType.UTF8 });
          await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', UTI: 'public.csv', dialogTitle: 'Share CSV' });
          Alert.alert('Export Complete', 'CSV file prepared for sharing.');
        } catch (err) {
          console.error('Failed to export CSV on native:', err);
          Alert.alert('Export Failed', 'Could not prepare CSV file for sharing.');
        }
      }
    } catch (err) {
      Alert.alert('Export Failed', (err as Error).message || 'An error occurred during export.');
      console.error('Error fetching all logs for export:', err);
    }
  };

  // Conditional rendering for loading, error, or no data states
  // Added `logs.length === 0` check to `loading` condition to prevent flash of 'No data'
  if (loading && logs.length === 0) return <Text style={{ padding: 20, textAlign: 'center' }}>Loading sensor logs...</Text>;
  if (error) return <Text style={{ padding: 20, textAlign: 'center', color: 'red' }}>Failed to load logs: {error}</Text>;
  if (!logs || logs.length === 0) return <Text style={{ padding: 20, textAlign: 'center' }}>No sensor logs available.</Text>;

  // Get dynamic styles based on screen size
  const styles = getStyles(isSmallScreen);

  return (
    <View style={[styles.container, {
      paddingRight: isLargeScreen ? 20 : 0, marginRight: isLargeScreen ? 0 : 0,
      paddingLeft: isLargeScreen ? 10 : 5
    }]}>
      {/* Header section with title and export button */}
      <View style={styles.header}>
        <Text style={styles.title}>All Sensor Data Logs</Text>
        <TouchableOpacity style={[styles.exportButton, { marginRight: isSmallScreen ? 10 : 2, padding: isSmallScreen ? 2 : 10 }]} onPress={exportToCSV}>

          <Ionicons name="download" size={16} color="#fff" />
          <Text style={styles.exportButtonText}>Export CSV</Text>
        </TouchableOpacity>
      </View>

      {/* Removed Filter Inputs as per previous request and this new pagination */}
      {/* <View style={styles.filterContainer}> ... </View> */}

      {/* Scrollable table for sensor logs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.tableWrapper}>
          {/* Table Header Row */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.tableCell, { width: isSmallScreen ? 150 : 268 }]}>Log ID</Text>
            <Text style={[styles.tableHeaderText, styles.tableCell, { width: isSmallScreen ? 150 : 200 }]}>Device ID</Text>
            <Text style={[styles.tableHeaderText, styles.tableCell, { width: isSmallScreen ? 180 : 240 }]}>Timestamp</Text>
            <Text style={[styles.tableHeaderText, styles.tableCell, { width: isSmallScreen ? 120 : 160 }]}>Temperature</Text>
            <Text style={[styles.tableHeaderText, styles.tableCell, { width: isSmallScreen ? 120 : 160 }]}>Humidity</Text>
            <Text style={[styles.tableHeaderText, styles.tableCell, { width: isSmallScreen ? 120 : 160, borderRightWidth: 0 }]}>Status</Text>
          </View>

          {/* Table Rows (Current Page's Logs) */}
          {logs.length > 0 ? (
            logs.map((log) => {
              const isAbnormal = log.temperature > 30 || log.humidity > 80;
              const status = isAbnormal ? 'Abnormal' : 'Normal';
              const statusStyle = isAbnormal ? styles.statusAbnormal : styles.statusNormal;
              const statusTextStyle = isAbnormal ? styles.statusAbnormalText : styles.statusNormalText;

              return (
                <View key={log._id ?? log.id ?? log.timestamp + Math.random()} style={styles.tableRow}>
                  <Text style={[styles.tableRowText, styles.tableCell, { width: isSmallScreen ? 150 : 268 }]}>{log._id ?? log.id}</Text>
                  <Text style={[styles.tableRowText, styles.tableCell, { width: isSmallScreen ? 150 : 200 }]}>{log.deviceId ?? 'N/A'}</Text>
                  <Text style={[styles.tableRowText, styles.tableCell, { width: isSmallScreen ? 180 : 240 }]}>{format(new Date(log.timestamp), 'dd/MM/yyyy, hh:mm a')}</Text>
                  <View style={[styles.tableCell, styles.valueCell, { width: isSmallScreen ? 120 : 160 }]}>
                    <Text style={styles.tableRowText}>{log.temperature}°C</Text>
                  </View>
                  <View style={[styles.tableCell, styles.valueCell, { width: isSmallScreen ? 120 : 160 }]}>
                    <Text style={styles.tableRowText}>{log.humidity}%</Text>
                  </View>
                  <View style={[styles.tableCell, styles.valueCell, { width: isSmallScreen ? 120 : 160, borderRightWidth: 0 }]}>
                    <View style={[styles.statusBadge, statusStyle]}>
                      <Text style={statusTextStyle}>{status}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.noResultsText}>No sensor logs found for this device.</Text>
          )}
        </View>
      </ScrollView>

      {/* Pagination Controls */}
      <View style={styles.paginationContainer}>
        <Text style={styles.paginationText}>
          Showing {totalRecords > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, totalRecords)} of {totalRecords} entries
        </Text>

        <View style={styles.paginationButtons}>
          <TouchableOpacity onPress={handlePrevPage} disabled={currentPage === 1 || loading} style={[styles.paginationButton, (currentPage === 1 || loading) && styles.paginationButtonDisabled]}>
            <Text style={styles.paginationButtonText}>Previous</Text>
          </TouchableOpacity>

          <Text style={styles.paginationPageInfo}>Page {totalPages === 0 ? 0 : currentPage} of {totalPages}</Text>

          <TouchableOpacity onPress={handleNextPage} disabled={currentPage === totalPages || totalPages === 0 || loading} style={[styles.paginationButton, (currentPage === totalPages || totalPages === 0 || loading) && styles.paginationButtonDisabled]}>
            <Text style={styles.paginationButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/**
 * Creates and returns a StyleSheet object for the component,
 * adjusting some styles based on screen size.
 *
 * @param isSmallScreen Boolean indicating if the screen is small.
 * @returns A StyleSheet object.
 */
const getStyles = (isSmallScreen: boolean) => StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: Platform.OS === 'web' ? 10 : 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333'
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight : 5
  },
  exportButtonText: {
    color: '#fff',
    marginRight: 8,
    fontWeight: '600',
    fontSize: 14
  },
  filterContainer: {
    marginBottom: 20,
    flexDirection: 'column', // Keeping this for reference, currently not rendered
    gap: 10
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9'
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
    fontSize: 14
  },
  dateInputGroup: {
    flexDirection: 'row',
    gap: 10
  },
  dateInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9'
  },
  dateInput: {
    flex: 1,
    height: 40,
    color: '#333',
    fontSize: 14
  },
  calendarIcon: {
    marginLeft: 8
  },
  tableWrapper: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    overflow: 'hidden'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderColor: '#dee2e6'
  },
  tableHeaderText: {
    fontWeight: '600',
    color: '#495057',
    fontSize: 14
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#dee2e6',
    alignItems: 'center'
  },
  tableCell: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#dee2e6',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tableRowText: {
    fontSize: 14,
    color: '#212529'
  },
  valueCell: {
    flexDirection: 'row',
    gap: 8
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 6
  },
  statusNormal: {
    backgroundColor: 'rgba(40, 167, 69, 0.15)'
  },
  statusAbnormal: {
    backgroundColor: 'rgba(220, 53, 69, 0.15)'
  },
  statusNormalText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#28a745'
  },
  statusAbnormalText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dc3545'
  },
  noResultsText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 14,
    color: '#777'
  },
  paginationContainer: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isSmallScreen ? 'flex-start' : 'center',
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    gap: isSmallScreen ? 12 : 0
  },
  paginationText: {
    fontSize: 14,
    color: '#555'
  },
  paginationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  paginationButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff'
  },
  paginationButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#f9f9f9'
  },
  paginationButtonText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 14
  },
  paginationPageInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 5
  },
});
