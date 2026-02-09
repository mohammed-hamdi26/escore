import axios from "axios";
import { getSession, refreshSession, deleteSession } from "./session";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getSession();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting session:", error.message);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track refresh state to prevent concurrent refresh attempts
let isRefreshing = false;
let refreshPromise = null;

// Response interceptor with auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401 (not 403), and not on retry or auth endpoints
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/")
    ) {
      originalRequest._retry = true;

      // If already refreshing, wait for the ongoing refresh
      if (isRefreshing) {
        try {
          const newToken = await refreshPromise;
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        } catch {
          // Refresh failed, fall through to error handling
        }
      } else {
        // Start a new refresh
        isRefreshing = true;
        refreshPromise = refreshSession();

        try {
          const newToken = await refreshPromise;
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
          // Refresh returned null — tokens are invalid
          await deleteSession();
          error.isAuthError = true;
        } catch {
          await deleteSession();
          error.isAuthError = true;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      }
    }

    // Handle other error cases
    if (error.response) {
      const { status } = error.response;

      if (status === 401 || status === 403) {
        error.isAuthError = true;
      }

      if (process.env.NODE_ENV === "development") {
        console.error(`API Error [${status}]:`, error.response.data);
      }
    } else if (error.request) {
      console.error("Network Error: No response received");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
