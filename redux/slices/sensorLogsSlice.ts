import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define the structure for a single sensor log item
export interface SensorLog {
  id?: string; // MongoDB _id can also be mapped to 'id'
  _id?: string; // Explicitly include _id if your API returns it
  deviceId: string;
  devicePayload?: string; // Optional if not always present or needed
  timestamp: string;
  temperature: number;
  humidity: number;
}

// Define the shape of the API response for paginated logs
export interface PaginatedSensorLogsResponse {
  data: SensorLog[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
}

// Define the state structure for sensor logs
interface SensorLogsState {
  logs: SensorLog[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
}

// Initial state for the sensor logs slice
const initialState: SensorLogsState = {
  logs: [],
  loading: false,
  error: null,
  currentPage: 1,      // Start at page 1
  totalPages: 1,       // Default to 1 total page
  totalRecords: 0,     // Default to 0 total records
};

// Define the base URL for your backend API
const API_BASE_URL = "https://akayaprotobackend.onrender.com"; // Use your local server URL

// Async thunk to fetch sensor logs with pagination parameters
// It now accepts a payload object for page, limit, and devicePayload
export const fetchSensorLogs = createAsyncThunk(
  "sensorLogs/fetchSensorLogs",
  async ({ page, limit,  }: { page: number; limit: number;  }) => {
    try {
      // Construct the URL with dynamic devicePayload, page, and limit
      const url = `${API_BASE_URL}/api/logs/device-0001?page=${page}&limit=${limit}`;
      const res = await axios.get<PaginatedSensorLogsResponse>(url);
      return res.data; // The payload is now the entire paginated response object
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch sensor logs");
      }
      throw error;
    }
  }
);

// Async thunk to fetch ALL sensor logs for CSV export (no pagination)
// This will hit the same endpoint but without page/limit, assuming your backend
// will return all data if these parameters are absent or a specific export endpoint.
// For now, we'll assume the backend allows fetching all if page/limit are omitted or set very high.
// A better approach would be to have a dedicated /api/logs/:payload/all or /api/logs/:payload/export endpoint.
export const fetchAllSensorLogsForExport = createAsyncThunk(
  "sensorLogs/fetchAllSensorLogsForExport",
  async ({ devicePayload }: { devicePayload: string }) => {
    try {
      // Fetch all logs (or a very high limit to ensure all are fetched if backend defaults to high limit)
      // If your backend has a dedicated /export endpoint, use that instead.
      const url = `${API_BASE_URL}/api/logs/${devicePayload}?limit=50000`; // Fetch a very large number
      const res = await axios.get<PaginatedSensorLogsResponse>(url);
      return res.data.data; // Return only the 'data' array for export
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch all sensor logs for export");
      }
      throw error;
    }
  }
);


const sensorLogsSlice = createSlice({
  name: "sensorLogs",
  initialState,
  reducers: {
    clearLogs: (state) => {
      state.logs = [];
      state.error = null;
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalRecords = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSensorLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSensorLogs.fulfilled,
        (state, action: PayloadAction<PaginatedSensorLogsResponse>) => {
          state.loading = false;
          // Store the logs for the current page
          state.logs = action.payload.data;
          // Store the pagination metadata
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
          state.totalRecords = action.payload.totalRecords;
        }
      )
      .addCase(fetchSensorLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch sensor logs";
        state.logs = []; // Clear logs on error
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalRecords = 0;
      })
      .addCase(fetchAllSensorLogsForExport.pending, (state) => {
        // You might want a separate loading state for export
        // For simplicity, we'll just keep the main loading state for now
        state.loading = true;
      })
      .addCase(fetchAllSensorLogsForExport.fulfilled, (state, action: PayloadAction<SensorLog[]>) => {
        state.loading = false;
        // No need to update logs in state, as this data is just for export
        // The action.payload here is just the array of all logs, not a state update.
        // The data will be used directly in the exportToCSV function.
      })
      .addCase(fetchAllSensorLogsForExport.rejected, (state, action) => {
        state.loading = false;
        // Handle export-specific error if needed
        console.error("Failed to fetch all logs for export:", action.error.message);
      });
  },
});

export const { clearLogs } = sensorLogsSlice.actions;
export default sensorLogsSlice.reducer;
