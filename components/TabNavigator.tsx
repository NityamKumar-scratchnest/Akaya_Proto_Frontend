import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Import the content components
import OverviewContent from './tabs/OverviewContent';
import SettingsContent from './tabs/SettingsContent';
import TabularDataContentNav from './tabs/TabularDataContent';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface Device {
  id: string;
  name: string;
  status: string;
  isLocked: boolean;
  temperature: number;
  humidity: number;
  batteryLevel: number;
  firmwareVersion: string;
  model: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  lastUpdate: string;
}

interface TabComponents {
  [key: string]: React.ComponentType<{ device?: Device }>;
}

const tabs = ['Overview', 'Tabular Data', 'Settings'];

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  device: Device;
}

export default function TabNavigation({ activeTab, setActiveTab, device }: TabNavigationProps) {
  const tabComponents: TabComponents = {
    Overview: OverviewContent,
    'Tabular Data': TabularDataContentNav,
    Settings: SettingsContent,
  };

  const ActiveComponent = tabComponents[activeTab];

  return (
    <View>
      <View style={styles.tabContainer}>
       {tabs.map((tab) => {
  const [isHovered, setIsHovered] = useState(false);

  // underline + text color logic
  let underlineColor = 'transparent';
  let textColor = '#6b7280'; // default gray

  if (activeTab === tab) {
    underlineColor = '#2563ec'; // active blue underline
    textColor = '#2563ec'; // active blue text
  } else if (isHovered) {
    underlineColor = '#ccc'; // hover gray
    textColor = '#383636ff'; // hover darker text
  }

  return (
    <Pressable
      key={tab}
      onPress={() => setActiveTab(tab)}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={styles.tabButton}
    >
      <Text style={[styles.tabText, { color: textColor }]}>{tab}</Text>
      <View style={[styles.underlineOverlay, { backgroundColor: underlineColor }]} />
    </Pressable>
  );
})}

      </View>

      {/* Full-width base underline (always visible, under the overlays) */}
      <View style={styles.fullBaseLine} />

      <View style={styles.tabContentContainer}>
        {ActiveComponent && <ActiveComponent device={device} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    gap: 40,
    marginTop: 50,
    marginHorizontal: 30,
    paddingHorizontal: 18,
    position: 'relative',
  },
  tabButton: {
    paddingBottom: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#999',
  },
  activeText: {
    color: '#3f3d3dff',
  },
  fullBaseLine: {
    height: 1,
    width: '94%',
    backgroundColor: '#eee', // light base line across full width
    marginTop: -2,
    marginHorizontal : 40,
    zIndex : -1
    // sits right under tab buttons
  },
  underlineOverlay: {
    position: 'absolute',
    bottom: 1, // place exactly on the line
    height: 2.5,
    width: '100%',
    borderRadius: 2,
  },
  tabContentContainer: {
    marginTop: 20,
  },
});
