import apiClient from "./apiCLient";

export async function getTournaments(searchParams = {}) {
  try {
    const params = new URLSearchParams();

    // Pagination
    if (searchParams.page) params.set("page", searchParams.page);
    if (searchParams.size) params.set("limit", searchParams.size);

    // Search
    if (searchParams.search) params.set("search", searchParams.search);

    // Filters
    if (searchParams.game) params.set("game", searchParams.game);
    if (searchParams.status) params.set("status", searchParams.status);
    if (searchParams.tier) params.set("tier", searchParams.tier);
    if (searchParams.isFeatured) params.set("isFeatured", searchParams.isFeatured);

    // Sorting
    if (searchParams.sortBy) params.set("sortBy", searchParams.sortBy);
    if (searchParams.sortOrder) params.set("sortOrder", searchParams.sortOrder);

    const queryString = params.toString();
    const url = queryString ? `/tournaments?${queryString}` : "/tournaments";

    const res = await apiClient.get(url);

    return {
      data: res.data?.data || [],
      pagination: res.data?.meta || {
        totalPages: 1,
        total: res.data?.data?.length || 0,
        page: 1,
        limit: 10,
      },
    };
  } catch (e) {
    console.error("Error fetching tournaments:", e);
    return {
      data: [],
      pagination: { totalPages: 1, total: 0, page: 1, limit: 10 },
    };
  }
}

export async function getTournament(id) {
  try {
    const res = await apiClient.get(`/tournaments/${id}`);
    return res.data?.data;
  } catch (e) {
    throw new Error("Error in Get tournament");
  }
}

export async function getNumOfTournaments() {
  try {
    const res = await apiClient.get(`/tournaments/count`);
    return res.data;
  } catch (e) {
    throw new Error("Error in Get number of tournaments");
  }
}

export async function getFeaturedTournaments() {
  try {
    const res = await apiClient.get(`/tournaments/featured`);
    return res.data?.data || [];
  } catch (e) {
    console.error("Error fetching featured tournaments:", e);
    return [];
  }
}

export async function getUpcomingTournaments() {
  try {
    const res = await apiClient.get(`/tournaments/upcoming`);
    return res.data?.data || [];
  } catch (e) {
    console.error("Error fetching upcoming tournaments:", e);
    return [];
  }
}
