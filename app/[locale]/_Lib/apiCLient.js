import axios from "axios";
import { cookies } from "next/headers";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,

  headers: {
    "Content-Type": "application/json",
  },
});
apiClient.interceptors.request.use(async (config) => {
  const token = (await cookies()).get("session")?.value;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export default apiClient;
