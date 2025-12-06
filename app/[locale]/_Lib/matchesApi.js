import { revalidatePath } from "next/cache";
import apiClient from "./apiCLient";

export async function getMatches(searchParams = {}) {
  // Map frontend params to backend params
  const paramMapping = {
    size: "limit",
    page: "page",
  };

  const mappedParams = {};
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      const mappedKey = paramMapping[key] || key;
      mappedParams[mappedKey] = value;
    }
  });

  const searchParamsString = Object.entries(mappedParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  try {
    const res = await apiClient.get(`/matches?${searchParamsString}`);
    // Return both data and pagination
    return {
      data: res.data.data,
      pagination: res.data.pagination,
    };
  } catch (e) {
    throw new Error("Error in get Matches");
  }
}

export async function getMatch(id) {
  try {
    const res = await apiClient.get(`/matches/${id}`);
    return res.data.data;
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
