// src/api/devicesApi.ts
import axios from "axios";

const baseURL = "https://akayaprotobackend.onrender.com"; // Ensure this matches your local server

// Define the structure of a single device as expected from the API
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
  createdAt: string; // Add createdAt as it's used for sorting on backend
  updatedAt: string; // Add updatedAt if your mongoose schema includes timestamps
  payload: string; // Add payload as it's a key identifier for devices
  secretKey: string; // Add secretKey if it's part of the device model (might be sensitive)
}

// Define the structure of the paginated API response for devices
export interface PaginatedDevicesResponse {
  data: ApiDevice[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
}

// Update the parameters interface for fetching devices
export interface FetchDevicesParams {
  accessToken: string;
  page?: number;      // New: for page-based pagination
  limit?: number;     // New: for page-based pagination
  search?: string;
  // Removed: cursor and prevCursor as we're switching to page-based pagination
  // cursor?: string | null;
  // prevCursor?: string | null;
}

// Update fetchDevicesApi to use page-based pagination
export const fetchDevicesApi = async ({
  accessToken,
  page = 1,        // Default page to 1
  limit = 20,      // Default limit to 20 (can match ITEMS_PER_PAGE from frontend)
  search = "",
}: FetchDevicesParams): Promise<PaginatedDevicesResponse> => {
  const res = await axios.get<PaginatedDevicesResponse>(`${baseURL}/api/devices`, {
    params: {
      page,        // Pass page number
      limit,       // Pass limit per page
      q: search,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // The API now directly returns { data, currentPage, totalPages, totalRecords }
  return res.data;
};

// Fetch device by ID (no changes needed for this specific function)
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

// Add a new device (no changes needed for this specific function)
export const addDeviceApi = async ({
  accessToken,
  deviceData,
}: {
  accessToken: string;
  deviceData: Record<string, any>;
}) => {
  // Assuming your backend's /api/devices post endpoint is /api/devices/add
  const res = await axios.post(`${baseURL}/api/devices/add`, deviceData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const fetchSensorLogsApi = async () => {
  return null
}
