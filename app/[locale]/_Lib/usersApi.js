import apiClient from "./apiCLient";

/**
 * Get logged in user profile
 */
export async function getLoginUser() {
  try {
    const res = await apiClient.get("/users/profile");
    return res.data.data;
  } catch (e) {
    console.error("Failed to get user:", e.response?.data || e.message);
    throw new Error("Failed to get user");
  }
}

/**
 * Get dashboard statistics
 */
export async function getAdminStats() {
  try {
    const res = await apiClient.get("/admin/stats");
    return res.data.data;
  } catch (e) {
    console.error("Failed to get stats:", e.response?.data || e.message);
    throw new Error("Failed to get stats");
  }
}

/**
 * Get users list with filters
 * @param {Object} searchParams - { page, limit, role, isVerified, contentStatus, search, isDeleted }
 */
export async function getUsers(searchParams = {}) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });

  try {
    const res = await apiClient.get(`/admin/users?${params.toString()}`);
    return { data: res.data.data, meta: res.data.meta };
  } catch (e) {
    console.error("Failed to get users:", e.response?.data || e.message);
    throw new Error("Failed to get users");
  }
}

/**
 * Get single user by ID
 * @param {string} id - User ID
 */
export async function getUser(id) {
  try {
    const res = await apiClient.get(`/admin/users/${id}`);
    return res.data.data;
  } catch (e) {
    console.error("Failed to get user:", e.response?.data || e.message);
    throw new Error("Failed to get user");
  }
}

/**
 * Get content creator requests
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 */
export async function getContentRequests(page = 1, limit = 20) {
  try {
    const res = await apiClient.get(`/admin/content-requests?page=${page}&limit=${limit}`);
    return { data: res.data.data, meta: res.data.meta };
  } catch (e) {
    console.error("Failed to get content requests:", e.response?.data || e.message);
    throw new Error("Failed to get content requests");
  }
}

/**
 * Get user permissions
 * @param {string} userId - User ID
 */
export async function getUserPermissions(userId) {
  try {
    const res = await apiClient.get(`/admin/users/${userId}/permissions`);
    return res.data.data;
  } catch (e) {
    console.error("Failed to get permissions:", e.response?.data || e.message);
    throw new Error("Failed to get permissions");
  }
}
