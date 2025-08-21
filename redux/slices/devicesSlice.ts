import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchDevicesApi } from "../../services/devicesApi";
import { addDeviceApi } from "../../services/devicesApi";
// --- Interfaces ---
export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Device {
  id: string;
  name: string;
  status: string;
  isLocked: boolean;
  temperature: number;
  humidity: number;
  batteryLevel: number;
  firmwareVersion: string;
  model: string;
  location: Location;
  lastUpdate: string;
}

interface DeviceState {
  devices: Device[];
  selectedDevice: Device | null;
  loading: boolean;
  error: string | null;
  nextCursor: string | null;
  prevCursor: string | null;
}

// --- Initial State ---
const initialState: DeviceState = {
  devices: [],
  selectedDevice: null,
  loading: false,
  error: null,
  nextCursor: null,
  prevCursor: null,
};

// --- Helper Mapper ---
const mapApiDevice = (item: any): Device => ({
  id: item._id,
  name: item.name,
  status: item.status,
  isLocked: item.isLocked ?? false,
  temperature: item.temperature ?? 0,
  humidity: item.humidity ?? 0,
  batteryLevel: item.batteryLevel ?? 0,
  firmwareVersion: item.firmwareVersion ?? "",
  model: item.model ?? "",
  location: item.location ?? { lat: 0, lng: 0, address: "" },
  lastUpdate: item.lastUpdate ?? "",
});

// --- Thunks ---
export const fetchDevices = createAsyncThunk(
  "devices/fetchDevices",
  async (
    {
      accessToken,
      limit,
      cursor,
      prevCursor,
      search,
    }: {
      accessToken: string | null;   // ✅ allow null here
      limit?: number;
      cursor?: string | null;
      prevCursor?: string | null;
      search?: string;
    },
    { rejectWithValue }
  ) => {
    if (!accessToken) {
      return rejectWithValue("Missing access token");
    }

    try {
      const res = await fetchDevicesApi({
        accessToken,
        limit,
        cursor,
        prevCursor,
        search,
      });

      return {
        devices: res.data.map(mapApiDevice),
        nextCursor: res.nextCursor || null,
        prevCursor: res.prevCursor || null,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// Add Device 

export const addDevice = createAsyncThunk(
  "devices/addDevice",
  async (
    {
      accessToken,
      deviceData,
    }: {
      accessToken: string | null;
      deviceData: Record<string, any>;
    },
    { rejectWithValue }
  ) => {
    if (!accessToken) {
      return rejectWithValue("Missing access token");
    }
    try {
      const res = await addDeviceApi({ accessToken, deviceData });
      // res is whatever addDeviceApi returns (it returns res.data).
      // Map to your Device shape:
      const created = (res && (res.data ?? res)) as any;
      return mapApiDevice(created);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);




// --- Slice ---
const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    resetDevices: (state) => {
      state.devices = [];
      state.nextCursor = null;
      state.prevCursor = null;
      state.selectedDevice = null;
    },
    setSelectedDevice: (state, action: PayloadAction<string>) => {
      state.selectedDevice =
        state.devices.find((d) => d.id === action.payload) || null;
    },
    toggleDeviceLock: (state, action: PayloadAction<string>) => {
      const device = state.devices.find((d) => d.id === action.payload);
      if (device) device.isLocked = !device.isLocked;
      if (state.selectedDevice?.id === action.payload) {
        state.selectedDevice.isLocked = !state.selectedDevice.isLocked;
      }
    },
    updateDeviceStatus: (
      state,
      action: PayloadAction<{ id: string; status: string }>
    ) => {
      const device = state.devices.find((d) => d.id === action.payload.id);
      if (device) device.status = action.payload.status;
      if (state.selectedDevice?.id === action.payload.id) {
        state.selectedDevice.status = action.payload.status;
      }
    },
    clearSelectedDevice: (state) => {
      state.selectedDevice = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(addDevice.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(addDevice.fulfilled, (state, action) => {
  state.loading = false;
  // Prepend the newly created device to the list
  state.devices.unshift(action.payload);
})
.addCase(addDevice.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
})
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload.devices;
        state.nextCursor = action.payload.nextCursor;
        state.prevCursor = action.payload.prevCursor;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      
  },
});

export const {
  resetDevices,
  setSelectedDevice,
  toggleDeviceLock,
  updateDeviceStatus,
  clearSelectedDevice,
} = devicesSlice.actions;

export default devicesSlice.reducer;
