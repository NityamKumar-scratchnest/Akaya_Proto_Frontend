import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DeviceSetting {
  [key: string]: any; // Adjust this to more specific settings if you have a defined structure
  // e.g. isLocked: boolean; batteryLevel: number;
}

interface DeviceSettingsState {
  deviceSettings: {
    [deviceId: string]: DeviceSetting;
  };
}

const initialState: DeviceSettingsState = {
  deviceSettings: {},
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateDeviceSettings: (
      state,
      action: PayloadAction<{ deviceId: string; [key: string]: any }>
    ) => {
      const { deviceId, ...settings } = action.payload;
      state.deviceSettings[deviceId] = settings;
    },
    toggleSetting: (
      state,
      action: PayloadAction<{ deviceId: string; setting: string }>
    ) => {
      const { deviceId, setting } = action.payload;
      const device = state.deviceSettings[deviceId];

      if (device) {
        const currentValue = device[setting];
        if (typeof currentValue === "boolean") {
          device[setting] = !currentValue;
        }
      }
    },
  },
});

export const { updateDeviceSettings, toggleSetting } = settingsSlice.actions;
export default settingsSlice.reducer;
