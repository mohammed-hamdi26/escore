import apiClient from "./apiCLient";
export async function getPlayers() {
  try {
    const res = await apiClient.get("/players");
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get players");
  }
}
