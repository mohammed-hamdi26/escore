import apiClient from "./apiCLient";

export async function getTeams(searchParams = {}) {
  const searchParamsString = Object.entries(searchParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  try {
    const res = await apiClient.get(`/teams?${searchParamsString}`);
    return res.data;
  } catch (e) {
    // console.log(e);
    // console.log(e.response);
    throw new Error("Failed to get teams");
  }
}

export async function getTeam(id) {
  try {
    const res = await apiClient.get(`/teams/${id}`);
    return res.data;
  } catch (e) {
    // console.log(e.response);
    throw new Error("Failed to get team");
  }
}
export async function getTeamsCount() {
  try {
    const res = await apiClient.get(`/teams/count`);
    return res.data;
  } catch (e) {
    // console.log(e.response);
    throw new Error("Failed to get teams count");
  }
}
