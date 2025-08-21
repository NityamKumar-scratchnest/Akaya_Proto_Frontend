import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { Device } from '../redux/slices/devicesSlice';
import { setSelectedDevice } from '../redux/slices/devicesSlice';
import { RootState } from '../redux/store';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const devices = useSelector((state: RootState) => state.devices.devices);
  const dispatch = useDispatch();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768 && width < 1024;
  const isLargeScreen = width >= 1024;

  const filteredDevices = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return devices.filter(
      d =>
        d.name.toLowerCase().includes(lowerQuery) ||
        d.id.toLowerCase().includes(lowerQuery)
    );
  }, [query, devices]);

  const handleSelect = (device: Device) => {
    dispatch(setSelectedDevice(device.id));
    router.push(`/device/${device.id}`);
    setQuery(''); // clear search input on select
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: isLargeScreen ? '83%' : isTablet ? '80%' : '96%',
          alignSelf: 'center',
          paddingLeft : isLargeScreen ? 0 : 5
        },
      ]}
    >
      <TextInput
        style={[
          styles.input,
          {
            fontSize: isLargeScreen ? 14 : isTablet ? 12 : 14,
            height: isLargeScreen ? 50 : 44,
          },
        ]}
        placeholder=" Search by device name or ID..."
        value={query}
        onChangeText={setQuery}
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="default"
      />

      {filteredDevices.length > 0 && (
        <FlatList
          data={filteredDevices}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.deviceName}>{item.name}</Text>
              <Text style={styles.deviceId}>{item.id}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight : 6,
    marginVertical: 12,
    zIndex: Platform.OS === 'web' ? 1000 : undefined,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  list: {
    maxHeight: 220,
    marginTop: 6,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  listItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  deviceName: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
  },
  deviceId: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
});
