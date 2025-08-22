import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// Ensure correct import path, assuming devicesApi.ts is in ../../services/
import { addDeviceApi, ApiDevice, fetchDevicesApi, PaginatedDevicesResponse } from "../../services/devicesApi";

// --- Interfaces ---
export interface Location {
  lat: number;
  lng: number;
  address: string;
}

// Client-side Device interface (should align with what your UI expects)
export interface Device {
  id: string; // Maps to _id from backend
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
  payload?: string; // Add payload as it's useful to have
}

// Updated DeviceState to include pagination metadata
interface DeviceState {
  devices: Device[];
  selectedDevice: Device | null;
  loading: boolean;
  error: string | null;
  currentPage: number;   // New
  totalPages: number;    // New
  totalRecords: number;  // New
}

// --- Initial State ---
const initialState: DeviceState = {
  devices: [],
  selectedDevice: null,
  loading: false,
  error: null,
  currentPage: 1,      // Initialize for pagination
  totalPages: 1,       // Initialize for pagination
  totalRecords: 0,     // Initialize for pagination
};

// --- Helper Mapper ---
// This function maps the backend's ApiDevice structure to your frontend's Device structure
const mapApiDevice = (item: ApiDevice): Device => ({
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
  lastUpdate: item.lastUpdate ?? "", // Ensure lastUpdate is mapped correctly from your backend field
  payload: item.payload, // Include payload
});

// --- Thunks ---
// fetchDevices now accepts `page` and `limit`
export const fetchDevices = createAsyncThunk(
  "devices/fetchDevices",
  async (
    {
      accessToken,
      page, // Accept page number
      limit, // Accept limit per page
      search,
    }: {
      accessToken: string | null;
      page?: number;
      limit?: number;
      search?: string;
    },
    { rejectWithValue }
  ) => {
    if (!accessToken) {
      return rejectWithValue("Missing access token");
    }

    try {
      // Call the updated API service with page and limit
      const res: PaginatedDevicesResponse = await fetchDevicesApi({
        accessToken,
        page,
        limit,
        search,
      });

      // Return the full paginated response directly
      return res; // The payload will be PaginatedDevicesResponse
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Add Device (no changes needed)
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
      const created = (res && (res.device ?? res)) as any; // Backend returns { message, device } or just device
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
    // Reset devices reducer now also resets pagination metadata
    resetDevices: (state) => {
      state.devices = [];
      state.selectedDevice = null;
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalRecords = 0;
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
        // If adding a device, totalRecords might increase
        state.totalRecords += 1;
        // Re-calculate total pages, assuming ITEMS_PER_PAGE from frontend for simplicity
        // In a complex app, you might re-fetch the first page to get accurate pagination info
        state.totalPages = Math.ceil(state.totalRecords / (initialState.devices.length > 0 ? initialState.devices.length : 20)); // Use a default ITEMS_PER_PAGE if devices array is empty
        state.currentPage = 1; // Go back to the first page when adding a new device
      })
      .addCase(addDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action: PayloadAction<PaginatedDevicesResponse>) => {
        state.loading = false;
        state.devices = action.payload.data.map(mapApiDevice); // Map raw API data to frontend Device interface
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalRecords = action.payload.totalRecords;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.devices = []; // Clear devices on error
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalRecords = 0;
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
