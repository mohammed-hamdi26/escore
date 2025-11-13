import apiClient from "./apiCLient";
export async function getPlayers(searchParams = {}) {
  const searchParamsString = Object.entries(searchParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  // console.log("searchParamsString in getPlayers", searchParamsString);
  try {
    const res = await apiClient.get(`/players?${searchParamsString}`);
    return res.data;
  } catch (e) {
    // console.log(e.response);
    throw new Error("Failed to get players");
  }
}

export async function getPlayer(id) {
  try {
    const res = await apiClient.get(`/players/${id}`);
    return res.data;
  } catch (e) {
    // console.log(e.response);
    throw new Error("Failed to get players");
  }
}
