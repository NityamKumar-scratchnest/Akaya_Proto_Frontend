import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface UserLog {
  _id: string;
  userId?: { email?: string; _id?: string } | null;
  method: string;
  endpoint: string;
  statusCode: number;
  ip: string;
  userAgent: string;
  createdAt: string;
  body?: Record<string, any>;
}

interface UserLogsState {
  logs: UserLog[];
  loading: boolean;
  error: string | null;
}

const initialState: UserLogsState = {
  logs: [],
  loading: false,
  error: null,
};

export const fetchUserLogs = createAsyncThunk<UserLog[]>(
  "userLogs/fetchUserLogs",
  async () => {
    const res = await axios.get("https://akayaprotobackend.onrender.com/api/userlogs");
    return res.data.data;
  }
);

const userLogsSlice = createSlice({
  name: "userLogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchUserLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch logs";
      });
  },
});

export default userLogsSlice.reducer;
