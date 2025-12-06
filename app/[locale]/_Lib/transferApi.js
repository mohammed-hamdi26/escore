import apiClient from "./apiCLient";

/**
 * Get transfers with filters and pagination
 */
export async function getTransfers(searchParams = {}) {
  try {
    const params = new URLSearchParams();

    // Pagination
    if (searchParams.page) params.set("page", searchParams.page);
    if (searchParams.limit) params.set("limit", searchParams.limit);
    if (searchParams.size) params.set("limit", searchParams.size);

    // Filters
    if (searchParams.search) params.set("search", searchParams.search);
    if (searchParams.status) params.set("status", searchParams.status);
    if (searchParams.type) params.set("type", searchParams.type);
    if (searchParams.game) params.set("game", searchParams.game);
    if (searchParams.player) params.set("player", searchParams.player);
    if (searchParams.team) params.set("team", searchParams.team);
    if (searchParams.fromTeam) params.set("fromTeam", searchParams.fromTeam);
    if (searchParams.toTeam) params.set("toTeam", searchParams.toTeam);
    if (searchParams.dateFrom) params.set("dateFrom", searchParams.dateFrom);
    if (searchParams.dateTo) params.set("dateTo", searchParams.dateTo);
    if (searchParams.isActive !== undefined) params.set("isActive", searchParams.isActive);

    const queryString = params.toString();
    const url = queryString ? `/transfers?${queryString}` : "/transfers";

    const res = await apiClient.get(url);

    return {
      data: res.data?.data || [],
      pagination: res.data?.pagination || { totalPages: 1, total: res.data?.data?.length || 0 }
    };
  } catch (e) {
    console.error("Failed to get transfers:", e.response?.data || e.message);
    return { data: [], pagination: { totalPages: 1, total: 0 } };
  }
}

/**
 * Get a single transfer by ID
 */
export async function getTransfer(id) {
  try {
    const res = await apiClient.get(`/transfers/${id}`);
    return res.data.data;
  } catch (e) {
    console.error("Failed to get transfer:", e.response?.data || e.message);
    throw new Error("Failed to get transfer");
  }
}

/**
 * Get recent confirmed transfers
 */
export async function getRecentTransfers(limit = 10) {
  try {
    const res = await apiClient.get(`/transfers/recent?limit=${limit}`);
    return res.data?.data || [];
  } catch (e) {
    console.error("Failed to get recent transfers:", e.response?.data || e.message);
    return [];
  }
}

/**
 * Get transfer rumors
 */
export async function getTransferRumors() {
  try {
    const res = await apiClient.get("/transfers/rumors");
    return res.data?.data || [];
  } catch (e) {
    console.error("Failed to get transfer rumors:", e.response?.data || e.message);
    return [];
  }
}

/**
 * Get transfers by player
 */
export async function getTransfersByPlayer(playerId) {
  try {
    const res = await apiClient.get(`/transfers/player/${playerId}`);
    return res.data?.data || [];
  } catch (e) {
    console.error("Failed to get player transfers:", e.response?.data || e.message);
    return [];
  }
}

/**
 * Get transfers by team
 */
export async function getTransfersByTeam(teamId) {
  try {
    const res = await apiClient.get(`/transfers/team/${teamId}`);
    return res.data?.data || [];
  } catch (e) {
    console.error("Failed to get team transfers:", e.response?.data || e.message);
    return [];
  }
}

/**
 * Get transfer statistics
 */
export async function getTransferStats() {
  try {
    // Get counts for each status
    const [allRes, confirmedRes, pendingRes, rumorsRes, cancelledRes] = await Promise.all([
      apiClient.get("/transfers?limit=1"),
      apiClient.get("/transfers?status=confirmed&limit=1"),
      apiClient.get("/transfers?status=pending&limit=1"),
      apiClient.get("/transfers?status=rumor&limit=1"),
      apiClient.get("/transfers?status=cancelled&limit=1"),
    ]);

    return {
      total: allRes.data?.pagination?.total || 0,
      confirmed: confirmedRes.data?.pagination?.total || 0,
      pending: pendingRes.data?.pagination?.total || 0,
      rumor: rumorsRes.data?.pagination?.total || 0,
      cancelled: cancelledRes.data?.pagination?.total || 0,
    };
  } catch (e) {
    console.error("Failed to get transfer stats:", e.response?.data || e.message);
    return null;
  }
}
