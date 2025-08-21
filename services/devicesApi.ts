// src/api/devicesApi.ts
import axios from "axios";

const baseURL = "https://akayaprotobackend.onrender.com";

export interface FetchDevicesParams {
  accessToken: string;
  limit?: number;
  cursor?: string | null;
  prevCursor?: string | null;
  search?: string;
}

export const fetchDevicesApi = async ({
  accessToken,
  limit = 30,
  cursor,
  prevCursor,
  search = "",
}: FetchDevicesParams) => {
  const res = await axios.get(`${baseURL}/api/devices`, {
    params: {
      limit,
      q: search,
      cursor: cursor || undefined,
      prevCursor: prevCursor || undefined,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // API returns { data, nextCursor, prevCursor }
  return res.data;
};


// Fetch device by ID
export const fetchDeviceByIdApi = async ({
  accessToken,
  deviceId,
}: {
  accessToken: string;
  deviceId: string;
}) => {
  const res = await axios.get(`${baseURL}/api/devices/${deviceId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

// Add a new device
export const addDeviceApi = async ({
  accessToken,
  deviceData,
}: {
  accessToken: string;
  deviceData: Record<string, any>;
}) => {
  const res = await axios.post(`${baseURL}/api/devices`, deviceData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const fetchSensorLogsApi = async ()=>{
  return null
}