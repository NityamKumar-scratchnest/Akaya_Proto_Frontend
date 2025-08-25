// src/api/devicesApi.ts
import axiosClient from "./axiosClient";

export interface ApiDevice {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
  payload: string;
  secretKey: string;
}

export interface PaginatedDevicesResponse {
  data: ApiDevice[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
}

export interface FetchDevicesParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Fetch devices (pagination)
export const fetchDevicesApi = async ({
  page = 1,
  limit = 21,
  search = "",
}: FetchDevicesParams): Promise<PaginatedDevicesResponse> => {
  const res = await axiosClient.get<PaginatedDevicesResponse>("/api/devices", {
    params: { page, limit, q: search },
  });
  return res.data;
};

// Fetch device by ID
export const fetchDeviceByIdApi = async (deviceId: string) => {
  const res = await axiosClient.get(`/api/devices/${deviceId}`);
  return res.data;
};

// Add device
export const addDeviceApi = async (deviceData: Record<string, any>) => {
  const res = await axiosClient.post("/api/devices/add", deviceData);
  return res.data;
};

// Example placeholder
export const fetchSensorLogsApi = async () => {
  return null;
};
