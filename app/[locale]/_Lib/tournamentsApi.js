import apiClient from "./apiCLient";

export async function getTournaments(searchParams = {}) {
  try {
    const params = new URLSearchParams();

    // Add pagination params
    if (searchParams.page) params.set("page", searchParams.page);
    if (searchParams.size) params.set("limit", searchParams.size);

    // Add search param
    if (searchParams.search) params.set("search", searchParams.search);

    const queryString = params.toString();
    const url = queryString ? `/tournaments?${queryString}` : "/tournaments";

    const res = await apiClient.get(url);

    console.log(res);

    return {
      data: res.data?.data,
      pagination: res.data?.pagination || {
        totalPages: 1,
        total: res.data?.data?.length || 0,
      },
    };
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
