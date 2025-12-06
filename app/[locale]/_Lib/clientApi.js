"use client";

import axios from "axios";

/**
 * Client-side API client (for use in client components)
 * Reads token from document.cookie instead of next/headers
 */
const clientApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

clientApi.interceptors.request.use((config) => {
  // Get session token from cookies (client-side)
  const cookies = document.cookie.split(";");
  const sessionCookie = cookies.find((c) => c.trim().startsWith("session="));
  const token = sessionCookie?.split("=")[1];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default clientApi;
