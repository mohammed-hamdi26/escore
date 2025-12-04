import apiClient from "./apiCLient";

export async function getTeams(searchParams = {}) {
  const searchParamsString = Object.entries(searchParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  try {
    const res = await apiClient.get(`/teams?${searchParamsString}`);
    return res.data.data;
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
