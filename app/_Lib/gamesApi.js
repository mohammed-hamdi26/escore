import apiClient from "./apiCLient";

export async function getGames() {
  try {
    const res = await apiClient.get("/games");
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
