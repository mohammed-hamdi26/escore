import apiClient from "./apiCLient";

export async function getGames(searchParams = {}) {
  const searchParamsString = Object?.entries(searchParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  try {
    const res = await apiClient.get(`/games?${searchParamsString}`);
    return res.data.data;
  } catch (e) {
    throw new Error("Failed to get games");
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
