// services/authApi.ts
const BASE_URL = "https://akayaprotobackend.onrender.com";

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`);
  }

  return res.json();
};
