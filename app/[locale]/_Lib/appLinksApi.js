import apiClient from "./apiCLient";

export async function getAppLinks() {
  try {
    const res = await apiClient.get("/settings/social-links");
    return res.data.data;
  } catch (error) {
    console.error("Error fetching app links:", error);
    return [];
  }
}
