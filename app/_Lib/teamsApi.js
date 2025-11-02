import apiClient from "./apiCLient";

export async function getTeams() {
  try {
    const res = await apiClient.get("/teams");
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get teams");
  }
}

export async function getTeam(id) {
  try {
    const res = await apiClient.get(`/teams/${id}`);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get team");
  }
}
