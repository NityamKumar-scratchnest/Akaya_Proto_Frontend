import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface SensorLog {
  id: string;
  deviceId: string;
  timestamp: string;
  temperature: number;
  humidity: number;
}

interface SensorLogsState {
  logs: SensorLog[];
  loading: boolean;
  error: string | null;
}

const initialState: SensorLogsState = {
  logs: [],
  loading: false,
  error: null,
};

// Hardcoded URL for now
export const fetchSensorLogs = createAsyncThunk(
  "sensorLogs/fetchSensorLogs",
  async () => {
    const res = await axios.get<SensorLog[]>(
      "https://akayaprotobackend.onrender.com/api/logs/device-0001"
    );
    return res.data;
  }
);

const sensorLogsSlice = createSlice({
  name: "sensorLogs",
  initialState,
  reducers: {
    clearLogs: (state) => {
      state.logs = [];
      state.error = null;
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
        (state, action: PayloadAction<SensorLog[]>) => {
          state.loading = false;
          state.logs = action.payload;
        }
      )
      .addCase(fetchSensorLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch sensor logs";
      });
  },
});

export const { clearLogs } = sensorLogsSlice.actions;
export default sensorLogsSlice.reducer;
