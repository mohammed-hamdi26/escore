import apiClient from "./apiCLient";

export async function getGames(searchParams = {}) {
  try {
    const params = new URLSearchParams();

    // Pagination
    if (searchParams.page) params.set("page", searchParams.page);
    if (searchParams.size) params.set("limit", searchParams.size);
    if (searchParams.limit) params.set("limit", searchParams.limit);

    // Search
    if (searchParams.search) params.set("search", searchParams.search);

    // Filters
    if (searchParams.isActive !== undefined && searchParams.isActive !== "") {
      params.set("isActive", searchParams.isActive);
    }

    // Sorting
    if (searchParams.sortBy) params.set("sortBy", searchParams.sortBy);
    if (searchParams.sortOrder) params.set("sortOrder", searchParams.sortOrder);

    const queryString = params.toString();
    const url = queryString ? `/games?${queryString}` : "/games";

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
    console.error("Error fetching games:", e);
    return {
      data: [],
      pagination: { totalPages: 1, total: 0, page: 1, limit: 10 },
    };
  }
}

export async function getGame(id) {
  try {
    const res = await apiClient.get(`/games/${id}`);
    return res.data.data;
  } catch (e) {
    console.log(e.response.data.errors || e.response.data || e.response || e);
    throw new Error("Failed to get game");
  }
}

export async function getGamesCount() {
  try {
    const res = await apiClient.get(`/games/count`);
    return res.data;
  } catch (e) {
    throw new Error("Failed to get games count");
  }
}
