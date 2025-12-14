import axios from "axios";
import { getSession, deleteSession } from "./session";

const eapiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
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

      // Handle 401 (Unauthorized) and 403 (Forbidden) - clear session
      if (status === 401 || status === 403) {
        try {
          await deleteSession();
          console.log("Session cleared due to authentication error");
        } catch (sessionError) {
          console.error("Failed to clear session:", sessionError.message);
        }
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
