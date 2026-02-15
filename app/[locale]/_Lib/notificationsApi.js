import apiClient from "./apiCLient";

/**
 * Get notification statistics (server-side)
 * @param {string} startDate - Optional start date (YYYY-MM-DD)
 * @param {string} endDate - Optional end date (YYYY-MM-DD)
 */
export async function getNotificationStats(startDate, endDate) {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const url = `/admin/notifications/stats${params.toString() ? `?${params.toString()}` : ""}`;
    const res = await apiClient.get(url);
    return res.data.data;
  } catch (e) {
    console.error("Failed to get notification stats:", e);
    throw new Error("Failed to get notification stats");
  }
}

/**
 * Get registered devices (server-side)
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {Object} filters - Optional filters { deviceType, isActive }
 */
export async function getRegisteredDevices(page = 1, limit = 20, filters = {}) {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (filters.deviceType) params.append("deviceType", filters.deviceType);
    if (filters.isActive !== undefined) params.append("isActive", filters.isActive.toString());

    const res = await apiClient.get(`/admin/notifications/devices?${params.toString()}`);
    return res.data;
  } catch (e) {
    console.error("Failed to get registered devices:", e);
    throw new Error("Failed to get registered devices");
  }
}

/**
 * Get all games for segment filter (server-side)
 */
export async function getGamesForFilter() {
  try {
    const res = await apiClient.get("/games?limit=100");
    return res.data.data || [];
  } catch (e) {
    console.error("Failed to get games:", e);
    return [];
  }
}

/**
 * Get all teams for segment filter (server-side)
 */
export async function getTeamsForFilter() {
  try {
    const res = await apiClient.get("/teams?limit=100");
    return res.data.data || [];
  } catch (e) {
    console.error("Failed to get teams:", e);
    return [];
  }
}

/**
 * Get all tournaments for segment filter (server-side)
 */
export async function getTournamentsForFilter() {
  try {
    const res = await apiClient.get("/tournaments?limit=100");
    return res.data.data || [];
  } catch (e) {
    console.error("Failed to get tournaments:", e);
    return [];
  }
}

/**
 * Get all users for specific users target (server-side)
 */
export async function getUsersForFilter() {
  try {
    const res = await apiClient.get("/admin/users?limit=100");
    return res.data.data || [];
  } catch (e) {
    console.error("Failed to get users:", e);
    return [];
  }
}

/**
 * Send notification (server-side action)
 * @param {Object} data - Notification data
 * @param {Object} data.target - Target { type, topic?, userIds?, filters? }
 * @param {Object} data.notification - { title, body, imageUrl?, data? }
 * @param {Object} data.options - { priority?, ttl?, dryRun? }
 */
export async function sendNotification(data) {
  try {
    const res = await apiClient.post("/admin/notifications/send", data);
    return res.data;
  } catch (e) {
    console.error("Failed to send notification:", e);
    throw new Error(e.response?.data?.message || "Failed to send notification");
  }
}

/**
 * Get admin notification history (server-side)
 */
export async function getNotificationHistory(page = 1, limit = 20, filters = {}) {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (filters.type) params.append("type", filters.type);
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.append("dateTo", filters.dateTo);
    if (filters.userId) params.append("userId", filters.userId);

    const res = await apiClient.get(`/admin/notifications/history?${params.toString()}`);
    return res.data;
  } catch (e) {
    console.error("Failed to get notification history:", e);
    throw new Error("Failed to get notification history");
  }
}

/**
 * Get notification stats timeline (server-side)
 */
export async function getNotificationTimeline(period = "30d", groupBy = "day") {
  try {
    const res = await apiClient.get(`/admin/notifications/stats/timeline?period=${period}&groupBy=${groupBy}`);
    return res.data.data;
  } catch (e) {
    console.error("Failed to get notification timeline:", e);
    return { timeline: [] };
  }
}

/**
 * Get notification templates (server-side)
 */
export async function getNotificationTemplates(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.type) params.append("type", filters.type);
    if (filters.isActive !== undefined) params.append("isActive", filters.isActive.toString());

    const url = `/admin/notifications/templates${params.toString() ? `?${params.toString()}` : ""}`;
    const res = await apiClient.get(url);
    return res.data.data || [];
  } catch (e) {
    console.error("Failed to get templates:", e);
    return [];
  }
}

/**
 * Get single notification template (server-side)
 */
export async function getNotificationTemplate(id) {
  try {
    const res = await apiClient.get(`/admin/notifications/templates/${id}`);
    return res.data.data;
  } catch (e) {
    console.error("Failed to get template:", e);
    throw new Error("Failed to get template");
  }
}
