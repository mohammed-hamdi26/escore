import { revalidatePath } from "next/cache";
import apiClient from "./apiCLient";

export async function getMatches(searchParams = {}) {
  const searchParamsString = Object.entries(searchParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  console.log("searchParamsString in getPlayers", searchParamsString);
  try {
    const res = await apiClient.get(`/matches?${searchParamsString}`);

    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in get Matches");
  }
}
