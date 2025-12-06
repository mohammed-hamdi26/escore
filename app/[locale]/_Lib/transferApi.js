import apiClient from "./apiCLient";

export async function getTransfers(searchParams = {}) {
  try {
    const params = new URLSearchParams();

    // Add pagination params
    if (searchParams.page) params.set("page", searchParams.page);
    if (searchParams.size) params.set("limit", searchParams.size);

    // Add search param
    if (searchParams.search) params.set("search", searchParams.search);

    const queryString = params.toString();
    const url = queryString ? `/transfers?${queryString}` : "/transfers";

    const res = await apiClient.get(url);

    return {
      data: res.data?.data,
      pagination: res.data?.pagination || { totalPages: 1, total: res.data?.data?.length || 0 }
    };
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get transfers");
  }
}
export async function getTransfer(id) {
  try {
    const res = await apiClient.get(`/transfers/${id}`);
    return res.data.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get transfer");
  }
}
