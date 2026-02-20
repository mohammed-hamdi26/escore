import apiClient from "./apiCLient";

export async function getClubs(searchParams = {}) {
  try {
    const params = new URLSearchParams();
    if (searchParams.page) params.set("page", searchParams.page);
    if (searchParams.size) params.set("limit", searchParams.size);
    if (searchParams.search) params.set("search", searchParams.search);
    if (searchParams.sortBy) params.set("sortBy", searchParams.sortBy);
    if (searchParams.sortOrder) params.set("sortOrder", searchParams.sortOrder);
    if (searchParams.isActive !== undefined && searchParams.isActive !== "") {
      params.set("isActive", searchParams.isActive);
    }
    if (searchParams.region) params.set("region", searchParams.region);

    const queryString = params.toString();
    const url = queryString ? `/clubs?${queryString}` : "/clubs";
    const res = await apiClient.get(url);

    return {
      data: res.data?.data || [],
      pagination: res.data?.meta || {
        totalPages: 1,
        total: 0,
        page: 1,
        limit: 10,
      },
    };
  } catch (e) {
    console.error("Error fetching clubs:", e);
    return {
      data: [],
      pagination: { totalPages: 1, total: 0, page: 1, limit: 10 },
    };
  }
}

export async function getClub(id) {
  try {
    const res = await apiClient.get(`/clubs/${id}`);
    return res.data.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get club");
  }
}

export async function getClubsLinks(id) {
  try {
    const res = await apiClient.get(`/clubs/${id}`);
    return res.data?.data?.socialLinks || [];
  } catch (e) {
    console.error("Error fetching club links:", e);
    return [];
  }
}

export async function getActiveClubs() {
  try {
    const res = await apiClient.get("/clubs/active");
    return res.data?.data || [];
  } catch (e) {
    console.error("Error fetching active clubs:", e);
    return [];
  }
}
