import apiClient from "./apiCLient";
export async function getPlayers(searchParams = {}) {
  const searchParamsString = Object.entries(searchParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  //
  try {
    const res = await apiClient.get(`/players?${searchParamsString}`);
    return res.data.data;
  } catch (e) {
    throw new Error("Failed to get players");
  }
}

export async function getPlayer(id) {
  try {
    const res = await apiClient.get(`/players/${id}`);
    return res.data.data;
  } catch (e) {
    throw new Error("Failed to get players");
  }
}

export async function getPlayersCount() {
  try {
    const res = await apiClient.get(`/players/count`);
    return res.data.data;
  } catch (e) {
    throw new Error("Failed to get players count");
  }
}
