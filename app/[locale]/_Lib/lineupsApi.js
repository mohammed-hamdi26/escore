"use server";
import apiClient from "./apiCLient";

export async function getLineups({ matchId }) {
  try {
    const res = await apiClient.get(`/lineups`, {
      params: { "matchId.equals": matchId },
    });

    return res.data;
  } catch (e) {
    throw new Error("Failed to get lineups");
  }
}
