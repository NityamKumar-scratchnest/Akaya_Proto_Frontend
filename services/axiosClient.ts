
import store from "../redux/store";
import { refreshAccessToken } from "./authApi";
import { setAccessToken, logout } from "../redux/slices/authSlice";
import axios from "axios";
const baseURL = "https://akayaprotobackend.onrender.com";

const axiosClient = axios.create({
  baseURL,
});

// Request interceptor → attach access token automatically
axiosClient.interceptors.request.use((config) => {
  const state = store.getState().auth;
  if (state.accessToken) {
    config.headers.Authorization = `Bearer ${state.accessToken}`;
  }
  return config;
});

// Response interceptor → handle 401 and refresh
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const state = store.getState().auth;

    // If Unauthorized AND refresh token exists AND not already retried
    if (
      error.response?.status === 401 &&
      state.refreshToken &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const { accessToken } = await refreshAccessToken(state.refreshToken);

        // Save new token to Redux
        store.dispatch(setAccessToken(accessToken));

        // Update header & retry original request
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
