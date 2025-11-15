import apiClient from "./apiCLient";

export async function getGames(searchParams = {}) {
  const searchParamsString = Object?.entries(searchParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  console.log("searchParamsString in getPlayers", searchParamsString);
  try {
    const res = await apiClient.get(`/games?${searchParamsString}`);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get games");
  }
}

export async function getGame(id) {
  try {
    const res = await apiClient.get(`/games/${id}`);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get game");
  }
}
