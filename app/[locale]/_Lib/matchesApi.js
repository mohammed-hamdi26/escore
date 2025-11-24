import { revalidatePath } from "next/cache";
import apiClient from "./apiCLient";

export async function getMatches(searchParams = {}) {
  const searchParamsString = Object.entries(searchParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  try {
    const res = await apiClient.get(`/matches?${searchParamsString}`);

    return res.data;
  } catch (e) {
    throw new Error("Error in get Matches");
  }
}

export async function getMatch(id) {
  try {
    const res = await apiClient.get(`/matches/${id}`);
    return res.data;
  } catch (e) {
    throw new Error("Failed to get Match");
  }
}
export async function getMatchesCount() {
  try {
    const res = await apiClient.get(`/matches/count`);
    return res.data;
  } catch (e) {
    throw new Error("Failed to get Matches Count");
  }
}
