import apiClient from "./apiCLient";

export async function getTeams(searchParams = {}) {
  try {
    const params = new URLSearchParams();

    // Add pagination params
    if (searchParams.page) params.set("page", searchParams.page);
    if (searchParams.size) params.set("limit", searchParams.size);

    // Add search param
    if (searchParams.search) params.set("search", searchParams.search);

    const queryString = params.toString();
    const url = queryString ? `/teams?${queryString}` : "/teams";

    const res = await apiClient.get(url);

    return {
      data: res.data?.data,
      pagination: res.data?.pagination || { totalPages: 1, total: res.data?.data?.length || 0 }
    };
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get teams");
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
