import apiClient from "./apiCLient";

export async function getLinks(id) {
  try {
    const res = await apiClient.get(`/social-links/${id}`);
    return res.data;
  } catch (e) {
    throw new Error("Failed to get links");
  }
}
