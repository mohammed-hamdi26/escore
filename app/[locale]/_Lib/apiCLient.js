import axios from "axios";
import { getSession } from "./session";

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

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle specific error cases
    if (error.response) {
      const { status } = error.response;

      // Handle 401 (Unauthorized) and 403 (Forbidden)
      // Note: We don't delete session here because cookies can only be modified
      // in Server Actions or Route Handlers, not during server component renders.
      // The calling code should handle session deletion via a Server Action.
      if (status === 401 || status === 403) {
        // Add a flag to the error for easier handling
        error.isAuthError = true;
      }

      // Log errors in development
      if (process.env.NODE_ENV === "development") {
        console.error(`API Error [${status}]:`, error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error: No response received");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
