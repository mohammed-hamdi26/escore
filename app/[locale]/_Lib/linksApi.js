import apiClient from "./apiCLient";

export async function getLinks(searchParams = {}) {
  try {
    const res = await apiClient.get(`/social-links`, { params: searchParams });
    return res.data;
  } catch (e) {
    throw new Error("Failed to get links");
  }
}
