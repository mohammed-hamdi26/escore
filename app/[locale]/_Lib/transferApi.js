import apiClient from "./apiCLient";

export async function getTransfers(searchParams = {}) {
  const searchParamsString = Object.entries(searchParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  try {
    const res = await apiClient.get(`/transfers?${searchParamsString}`);
    return res.data.data;
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
