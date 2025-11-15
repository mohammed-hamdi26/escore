import apiClient from "./apiCLient";

export async function getTournaments(searchParams = {}) {
  const searchParamsString = Object.entries(searchParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  try {
    const res = await apiClient.get(`/tournaments?${searchParamsString}`);

    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in Get tournaments");
  }
}
export async function getTournament(id) {
  try {
    const res = await apiClient.get(`/tournaments/${id}`);

    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in Get tournament");
  }
}
