import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSensorLogs } from '../redux/slices/sensorLogsSlice';
import { AppDispatch, RootState } from '../redux/store';

export interface SensorLog {
  id?: string;
  _id?: string;
  deviceId?: string;
  devicePayload?: string;
  timestamp: string;
  temperature: number;
  humidity: number;
}

export interface Device {
  id?: string;
  _id?: string;
  deviceId?: string;
  name?: string;
  devicePayload?: string;
  serial?: string;
}

const ITEMS_PER_PAGE = 20;

export default function SensorLogsTable() {
  const dispatch = useDispatch<AppDispatch>();

  const rawLogs = useSelector((state: RootState) => state.sensorLogs.logs);
  const loading = useSelector((state: RootState) => state.sensorLogs.loading);
  const error = useSelector((state: RootState) => state.sensorLogs.error);

  const device = useSelector((state: RootState) => state.devices.selectedDevice) as Device | undefined;

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const isLargeScreen = width > 768

  const [searchId, setSearchId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchSensorLogs());
  }, [dispatch]);


  const allSensorLogs: SensorLog[] = useMemo(() => {
    if (!rawLogs) return [];
    if (Array.isArray(rawLogs)) return rawLogs as SensorLog[];
    if (Array.isArray((rawLogs as any).data)) return (rawLogs as any).data as SensorLog[];
    if (
      typeof rawLogs === 'object' &&
      rawLogs !== null &&
      'logs' in rawLogs &&
      Array.isArray((rawLogs as any).logs.data)
    ) {
      return (rawLogs as any).logs.data as SensorLog[];
    }
    return [];
  }, [rawLogs]);

  const parseDateString = (dateString: string): Date | null => {
    if (!dateString) return null;
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime()) && date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
        return date;
      }
    }
    return null;
  };


  const filteredLogs = useMemo(() => {

    let logs = allSensorLogs;


    // console.log('logs before search/date filters:', logs.length);


    if (searchId) {
      const q = searchId.toLowerCase();
      logs = logs.filter((log) => (
        String(log.id ?? log._id ?? '').toLowerCase().includes(q) ||
        String(log.deviceId ?? '').toLowerCase().includes(q) ||
        String(log.devicePayload ?? '').toLowerCase().includes(q)
      ));
    }

    const from = parseDateString(fromDate);
    const to = parseDateString(toDate);

    logs = logs.filter((log) => {
      const logDate = new Date(log.timestamp);
      if (from && logDate < from) return false;
      if (to) {
        const endDate = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999);
        if (logDate > endDate) return false;
      }
      return true;
    });

    const sorted = logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    console.log('filteredLogs length after all filters:', sorted.length);
    return sorted;
  }, [allSensorLogs, searchId, fromDate, toDate]);


  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  useEffect(() => {

    setCurrentPage(1);
  }, [searchId, fromDate, toDate]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage((p) => p + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage((p) => p - 1); };


  const exportToCSV = async () => {
    if (filteredLogs.length === 0) {
      Alert.alert('No Data', 'There is no data to export.');
      return;
    }
    const header = ['ID', 'Device ID', 'Timestamp', 'Temperature (°C)', 'Humidity (%)', 'Status'].join(','); // Added Device ID
    const rows = filteredLogs.map((log) => {
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
    } else {
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
  };


  if (loading) return <Text style={{ padding: 20, textAlign: 'center' }}>Loading sensor logs...</Text>;
  if (error) return <Text style={{ padding: 20, textAlign: 'center', color: 'red' }}>Failed to load logs: {error}</Text>;

  if (!allSensorLogs || allSensorLogs.length === 0) return <Text style={{ padding: 20, textAlign: 'center' }}>No sensor logs available.</Text>;

  const styles = getStyles(isSmallScreen);

  return (
    <View style={[styles.container, {
      paddingRight: isLargeScreen ? 20 : 0, marginRight: isLargeScreen ? 0 : 0,
      paddingLeft: isLargeScreen ? 10 : 0
    }]}>

      <View style={styles.header}>
        <Text style={styles.title}>All Sensor Data Logs</Text>
        <TouchableOpacity style={[styles.exportButton, { marginLeft: isSmallScreen ? 15 : 2, padding: isSmallScreen ? 2 : 10 }]} onPress={exportToCSV}>
          <Ionicons name="download" size={16} color="#fff" />
          <Text style={styles.exportButtonText}>Export CSV</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.filterContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search by ID or Device ID..." placeholderTextColor="#888" value={searchId} onChangeText={setSearchId} /> {/* Updated placeholder */}
        </View>

        <View style={styles.dateInputGroup}>
          <View style={styles.dateInputContainer}>
            <TextInput style={styles.dateInput} placeholder="From: dd-mm-yyyy" placeholderTextColor="#888" value={fromDate} onChangeText={setFromDate} />
            <Ionicons name="calendar-outline" size={20} color="#888" style={styles.calendarIcon} />
          </View>
          <View style={styles.dateInputContainer}>
            <TextInput style={styles.dateInput} placeholder="To: dd-mm-yyyy" placeholderTextColor="#888" value={toDate} onChangeText={setToDate} />
            <Ionicons name="calendar-outline" size={20} color="#888" style={styles.calendarIcon} />
          </View>
        </View>
      </View>


      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.tableWrapper}>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.tableCell, { width: isSmallScreen ? 150 : 268 }]}>Log ID</Text> {/* Renamed */}
            <Text style={[styles.tableHeaderText, styles.tableCell, { width: isSmallScreen ? 150 : 200 }]}>Device ID</Text> {/* New column */}
            <Text style={[styles.tableHeaderText, styles.tableCell, { width: isSmallScreen ? 180 : 240 }]}>Timestamp</Text>
            <Text style={[styles.tableHeaderText, styles.tableCell, { width: isSmallScreen ? 120 : 160 }]}>Temperature</Text>
            <Text style={[styles.tableHeaderText, styles.tableCell, { width: isSmallScreen ? 120 : 160 }]}>Humidity</Text>
            <Text style={[styles.tableHeaderText, styles.tableCell, { width: isSmallScreen ? 120 : 160, borderRightWidth: 0 }]}>Status</Text>
          </View>


          {paginatedLogs.length > 0 ? (
            paginatedLogs.map((log) => {
              const isAbnormal = log.temperature > 30 || log.humidity > 80;
              const status = isAbnormal ? 'Abnormal' : 'Normal';
              const statusStyle = isAbnormal ? styles.statusAbnormal : styles.statusNormal;
              const statusTextStyle = isAbnormal ? styles.statusAbnormalText : styles.statusNormalText;

              return (
                <View key={log._id ?? log.id ?? JSON.stringify(log.timestamp)} style={styles.tableRow}>
                  <Text style={[styles.tableRowText, styles.tableCell, { width: isSmallScreen ? 150 : 268 }]}>{log._id ?? log.id}</Text>
                  <Text style={[styles.tableRowText, styles.tableCell, { width: isSmallScreen ? 150 : 200 }]}>Akaya Hot</Text> {/* Display Device ID */}
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
            <Text style={styles.noResultsText}>No sensor logs found matching your criteria.</Text>
          )}
        </View>
      </ScrollView>


      <View style={styles.paginationContainer}>
        <Text style={styles.paginationText}>
          Showing {filteredLogs.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} entries
        </Text>

        <View style={styles.paginationButtons}>
          <TouchableOpacity onPress={handlePrevPage} disabled={currentPage === 1} style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}>
            <Text style={styles.paginationButtonText}>Previous</Text>
          </TouchableOpacity>

          <Text style={styles.paginationPageInfo}>Page {totalPages === 0 ? 0 : currentPage} of {totalPages}</Text>

          <TouchableOpacity onPress={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} style={[styles.paginationButton, (currentPage === totalPages || totalPages === 0) && styles.paginationButtonDisabled]}>
            <Text style={styles.paginationButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


const getStyles = (isSmallScreen: boolean) => StyleSheet.create({

  container:
  {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    
    margin: Platform.OS === 'web' ? 10 : 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  exportButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#007bff', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 15 },
  exportButtonText: { color: '#fff', marginRight: 8, fontWeight: '600', fontSize: 14 },
  filterContainer: { marginBottom: 20, flexDirection: isSmallScreen ? 'column' : 'row', gap: 10 },
  searchInputContainer: { flex: isSmallScreen ? 0 : 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#f9f9f9' },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 40, color: '#333', fontSize: 14 },
  dateInputGroup: { flex: isSmallScreen ? 0 : 1.5, flexDirection: 'row', gap: 10 },
  dateInputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#f9f9f9' },
  dateInput: { flex: 1, height: 40, color: '#333', fontSize: 14 },
  calendarIcon: { marginLeft: 8 },
  tableWrapper: { borderWidth: 1, borderColor: '#dee2e6', borderRadius: 8, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f8f9fa', borderBottomWidth: 1, borderColor: '#dee2e6' },
  tableHeaderText: { fontWeight: '600', color: '#495057', fontSize: 14 },
  tableRow: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dee2e6', alignItems: 'center' },
  tableCell: { paddingVertical: 12, paddingHorizontal: 10, borderRightWidth: 1, borderColor: '#dee2e6', textAlign: 'center', justifyContent: 'center', alignItems: 'center' },
  tableRowText: { fontSize: 14, color: '#212529' },
  valueCell: { flexDirection: 'row', gap: 8 },
  statusBadge: { paddingVertical: 3, paddingHorizontal: 10, borderRadius: 6 },
  statusNormal: { backgroundColor: 'rgba(40, 167, 69, 0.15)' },
  statusAbnormal: { backgroundColor: 'rgba(220, 53, 69, 0.15)' },
  statusNormalText: { fontSize: 12, fontWeight: '600', color: '#28a745' },
  statusAbnormalText: { fontSize: 12, fontWeight: '600', color: '#dc3545' },
  noResultsText: { textAlign: 'center', padding: 20, fontSize: 14, color: '#777' },
  paginationContainer: { flexDirection: isSmallScreen ? 'column' : 'row', justifyContent: 'space-between', alignItems: isSmallScreen ? 'flex-start' : 'center', marginTop: 20, paddingTop: 10, borderTopWidth: 1, borderColor: '#f0f0f0', gap: isSmallScreen ? 12 : 0 },
  paginationText: { fontSize: 14, color: '#555' },
  paginationButtons: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  paginationButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#fff' },
  paginationButtonDisabled: { opacity: 0.5, backgroundColor: '#f9f9f9' },
  paginationButtonText: { color: '#333', fontWeight: '500', fontSize: 14 },
  paginationPageInfo: { fontSize: 14, fontWeight: '600', color: '#333', marginHorizontal: 5 },
});