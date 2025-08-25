// services/apiClient.ts
import store from "../redux/store";
import { refreshAccessToken } from "./authApi";
import { setAccessToken, logout } from "../redux/slices/authSlice";

const BASE_URL = "https://akayaprotobackend.onrender.com";

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  let state = store.getState().auth;
  let accessToken = state.accessToken;
  console.log(accessToken)
  const refreshToken = state.refreshToken;
  console.log(refreshToken)

  const makeRequest = async (token?: string) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || accessToken}`,
      },
    });
    return res;
  };

  let res = await makeRequest();
  console.log("RES Status ", res.status)

  if (res.status === 401 && refreshToken) {
  try {
    const { accessToken: newToken } = await refreshAccessToken(refreshToken);
    store.dispatch(setAccessToken(newToken));
    res = await makeRequest(newToken);
  } catch (err) {
    console.error("Refresh failed", err);

    // ❌ old behavior
    // store.dispatch(logout());
    // throw err;

    // ✅ new behavior: keep user logged in, just bubble up error
    throw new Error("Session refresh failed, but user still authenticated.");
  }
}
  if (!res.ok) {
    throw new Error(`API failed: ${res.status}`);
  }

  return res.json();
};
