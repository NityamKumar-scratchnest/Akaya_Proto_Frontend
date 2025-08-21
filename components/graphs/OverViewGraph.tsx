// OverViewGraph.tsx
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import {
  Dimensions,
  Platform,
  Text as RNText,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Picker } from '@react-native-picker/picker';

// Get screen dimensions
const { width: windowWidth } = Dimensions.get('window');
const CHART_HEIGHT = Platform.OS === 'web' ? 350 : 250;
const CHART_BASE_WIDTH_MOBILE = windowWidth - 60;

function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

export interface SensorLog {
  id: string;
  deviceId: string;
  timestamp: string;
  temperature: number;
  humidity: number;
}

interface TempHumidityChartGiftedProps {
  deviceId: string;
}

const PRESETS = [
  { key: '1h', label: 'Last 1h', durationMs: 60 * 60 * 1000 },
  { key: '1d', label: 'Last 1d', durationMs: 24 * 60 * 60 * 1000 },
  { key: '3d', label: 'Last 3d', durationMs: 3 * 24 * 60 * 60 * 1000 },
  { key: '7d', label: 'Last 7d', durationMs: 7 * 24 * 60 * 60 * 1000 },
];

const generateChartData = (deviceId: string, totalHours: number): SensorLog[] => {
  const data: SensorLog[] = [];
  const now = Date.now();
  for (let i = totalHours; i >= 0; i--) {
    const timestamp = now - i * 60 * 60 * 1000;
    data.push({
      id: `${deviceId}-log-${timestamp}`,
      deviceId,
      timestamp: new Date(timestamp).toISOString(),
      temperature: parseFloat((20 + Math.random() * 10).toFixed(1)),
      humidity: parseFloat((50 + Math.random() * 30).toFixed(1)),
    });
  }
  return data;
};

const ZOOM_LEVELS = [1, 1.5, 2, 2.5, 3];

export default function TempHumidityChartGifted({ deviceId }: TempHumidityChartGiftedProps) {
  const [activePreset, setActivePreset] = useState('1d');
  const [customFromDate, setCustomFromDate] = useState('Day 1');
  const [customToDate, setCustomToDate] = useState('Day 7');
  const [zoomIndex, setZoomIndex] = useState(0);

  const { width } = useWindowDimensions();
  const isLargeScreen = width > 720;

  const allGeneratedLogs = useMemo(
    () => generateChartData(deviceId, 7 * 24),
    [deviceId]
  );

  const filteredLogs = useMemo(() => {
    let logs = [...allGeneratedLogs];
    const now = Date.now();
    let startTime: number | null = null;
    let endTime: number = now;

    if (activePreset !== 'custom') {
      const preset = PRESETS.find((p) => p.key === activePreset);
      if (preset) {
        startTime = now - preset.durationMs;
      }
    } else {
      const from = customFromDate ? new Date(customFromDate).getTime() : null;
      const to = customToDate ? new Date(customToDate).getTime() : null;
      if (from) startTime = from;
      if (to) endTime = to;
    }

    if (startTime !== null) {
      logs = logs.filter(
        (log) =>
          new Date(log.timestamp).getTime() >= startTime &&
          new Date(log.timestamp).getTime() <= endTime
      );
    }
    return logs.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [activePreset, allGeneratedLogs, customFromDate, customToDate]);

  if (filteredLogs.length === 0) {
    return (
      <View style={[styles.container, styles.noDataContainer]}>
        <RNText style={styles.noDataText}>
          No sensor data available for this period.
        </RNText>
      </View>
    );
  }

  const tempData = filteredLogs.map((d) => ({
    value: d.temperature,
    label: formatTime(new Date(d.timestamp).getTime()),
    originalDataPoint: d,
  }));

  const humData = filteredLogs.map((d) => ({
    value: d.humidity,
    label: formatTime(new Date(d.timestamp).getTime()),
    originalDataPoint: d,
  }));

  const zoomLevel = ZOOM_LEVELS[zoomIndex];
  const totalPoints = tempData.length;
  const spacing = Math.max(
    25,
    (CHART_BASE_WIDTH_MOBILE * zoomLevel) / Math.max(1, totalPoints)
  );
  const chartWidth = Math.max(CHART_BASE_WIDTH_MOBILE, spacing * totalPoints);

  const handleZoomIn = () =>
    setZoomIndex((prev) => Math.min(prev + 1, ZOOM_LEVELS.length - 1));
  const handleZoomOut = () =>
    setZoomIndex((prev) => Math.max(prev - 1, 0));

  return (
    <View
      style={[
        styles.outerContainer,
        {
          marginLeft: isLargeScreen ? 30 : 0,
          paddingTop: isLargeScreen ? 10 : 10,
          paddingLeft: isLargeScreen ? 25 : 0,
          borderRadius: isLargeScreen ? 10 : 5,
          paddingRight : isLargeScreen ? 40 : 0,
          marginRight : isLargeScreen ? 60 : 0
        },
      ]}
    >
      {/* Preset filter buttons */}
      <ScrollView
        horizontal
        contentContainerStyle={styles.filterButtonContainer}
        showsHorizontalScrollIndicator={false}
      >
        {PRESETS.map((p) => (
          <TouchableOpacity
            key={p.key}
            onPress={() => setActivePreset(p.key)}
            style={[
              styles.filterButton,
              activePreset === p.key && styles.filterButtonActive,
            ]}
          >
            <RNText
              style={[
                styles.filterButtonText,
                activePreset === p.key && styles.filterButtonTextActive,
              ]}
            >
              {p.label}
            </RNText>
          </TouchableOpacity>
        ))}
        {/* <RNText style={styles.customWindow}>Custom Windows</RNText> */}
         
      
      </ScrollView>

      {/* Always visible custom pickers */}
     

      {/* Chart Card */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <RNText style={styles.chartTitle}>
            {activePreset === 'custom'
              ? 'Custom History'
              : PRESETS.find((p) => p.key === activePreset)?.label + ' History'}
          </RNText>
          <View style={styles.zoomButtonsContainer}>
            <TouchableOpacity onPress={handleZoomOut} style={styles.zoomButton}>
              <RNText style={styles.zoomButtonText}>-</RNText>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleZoomIn} style={styles.zoomButton}>
              <RNText style={styles.zoomButtonText}>+</RNText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chart Viewport */}
        <View style={styles.chartViewport}>
          <ScrollView
            horizontal
            contentContainerStyle={{ paddingHorizontal: 16 }}
            showsHorizontalScrollIndicator={false}
            style={styles.chartScroll}
          >
            <View style={styles.chartInner}>
              <LineChart
                curved
                thickness={2.5}
                data={tempData}
                data2={humData}
                color1="#E53935"
                color2="#1E88E5"
                height={CHART_HEIGHT}
                width={chartWidth}
                spacing={spacing}
                initialSpacing={16}
                hideDataPoints
                yAxisThickness={0.6}
                xAxisThickness={0.6}
                yAxisTextStyle={{ fontSize: 12, color: 'gray' }}
                xAxisLabelTextStyle={{
                  fontSize: 10,
                  rotation: 45,
                  color: 'gray',
                }}
                yAxisLabelWidth={40}
                isAnimated
                showVerticalLines
                verticalLinesColor="#eee"
                xAxisColor="#ddd"
                yAxisColor="#ddd"
                maxValue={80}
                noOfSections={4}
                yAxisLabelTexts={['0', '20', '40', '60', '80']}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 6, paddingRight: 10 },
  outerContainer: {
    backgroundColor: '#fff',
    width: '100%',
    flex: 1,
    paddingTop: 60,
    paddingRight: 20,
    borderRadius: 50,
    marginTop: 10
  },
  filterButtonContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignSelf: 'center',
  },
  filterButton: {
    marginTop : 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  customWindow:{
    paddingTop : 36,
    paddingLeft : 10,
  },
  customWindowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    gap: 10,
    paddingHorizontal: 10,
    width:200,
    marginTop : 28
  },
  pickerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    height: 38,
    overflow: 'hidden',
    width : 20
  },
  picker: {
    flex: 1,
    width: '100%',
    color: '#333',
    outlineWidth: 0, // removes blue border in web
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingBottom : 10
  },
  pickerLabel: {
    paddingTop : 35,
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    
  },
  chartCard: {
    backgroundColor: '#fff',
    padding: 12,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  zoomButtonsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginRight: 20,
  },
  zoomButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  zoomButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  chartViewport: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  chartScroll: {
    width: '100%',
    backgroundColor: '#fff',
  },
  chartInner: {
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  noDataContainer: {
    minHeight: CHART_HEIGHT,
    width: CHART_BASE_WIDTH_MOBILE,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#6c757d',
  },
});




// Custom Picker 

