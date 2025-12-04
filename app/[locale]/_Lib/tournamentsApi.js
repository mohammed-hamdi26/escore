import apiClient from "./apiCLient";

export async function getTournaments(searchParams = {}) {
  // const searchParamsString = Object.entries(searchParams)
  //   .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
  //   .join("&");

  try {
    const res = await apiClient.get(`/tournaments`);

    return { data: res.data?.data, meta: res.data?.meta };
  } catch (e) {
    throw new Error("Error in Get tournaments");
  }
}
export async function getTournament(id) {
  try {
    const res = await apiClient.get(`/tournaments/${id}`);

    return res.data?.data;
  } catch (e) {
    throw new Error("Error in Get tournament");
  }
}
export async function getNumOfTournaments() {
  try {
    const res = await apiClient.get(`/tournaments/count`);

    return res.data;
  } catch (e) {
    throw new Error("Error in Get number of tournaments");
  }
}
