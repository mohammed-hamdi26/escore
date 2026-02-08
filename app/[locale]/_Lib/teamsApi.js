import apiClient from "./apiCLient";

export async function getTeams(searchParams = {}) {
  try {
    const params = new URLSearchParams();

    // Add pagination params
    if (searchParams.page) params.set("page", searchParams.page);
    if (searchParams.size) params.set("limit", searchParams.size);

    // Add search param
    if (searchParams.search) params.set("search", searchParams.search);

    // Add filter params
    if (searchParams.game) params.set("game", searchParams.game);
    if (searchParams.country) params.set("country", searchParams.country);
    if (searchParams.region) params.set("region", searchParams.region);
    if (searchParams.isActive !== undefined && searchParams.isActive !== "") {
      params.set("isActive", searchParams.isActive);
    }

    // Add sort params
    if (searchParams.sortBy) params.set("sortBy", searchParams.sortBy);
    if (searchParams.sortOrder) params.set("sortOrder", searchParams.sortOrder);

    const queryString = params.toString();
    const url = queryString ? `/teams?${queryString}` : "/teams";

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
    console.error("Error fetching teams:", e);
    return {
      data: [],
      pagination: { totalPages: 1, total: 0, page: 1, limit: 10 },
    };
  }
}

export async function getTeam(id) {
  try {
    const res = await apiClient.get(`/teams/${id}`);
    return res.data.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get team");
  }
}
export async function getTeamsCount() {
  try {
    const res = await apiClient.get(`/teams/count`);
    return res.data.data;
  } catch (e) {
    throw new Error("Failed to get teams count");
  }
}

export async function getTeamsLinks(id) {
  try {
    const res = await apiClient.get(`/teams/${id}`);
    console.log(res.data.data.socialLinks);
    return res.data.data.socialLinks;
  } catch (e) {
    throw new Error("Failed to get teams links");
  }
}

export async function getAwardsTeam(id) {
  try {
    const res = await apiClient.get(`/teams/${id}`);
    return res.data.data.awards;
  } catch (e) {
    throw new Error("Failed to get awards team");
  }
}

export async function toggleTeamActive(id, isActive) {
  try {
    const res = await apiClient.patch(`/teams/${id}`, { isActive });
    return res.data.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to toggle team active status");
  }
}

export async function deleteTeam(id) {
  try {
    const res = await apiClient.delete(`/teams/${id}`);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to delete team");
  }
}

export async function createTeam(data) {
  try {
    const res = await apiClient.post("/teams", data);
    return res.data.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to create team");
  }
}

export async function updateTeam(id, data) {
  try {
    const res = await apiClient.patch(`/teams/${id}`, data);
    return res.data.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to update team");
  }
}
