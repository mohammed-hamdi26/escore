import apiClient from "./apiCLient";

export async function getAppLinks() {
  try {
    const res = await apiClient.get("/v1/escore-social-links");
    return res.data.data;
  } catch (error) {
    console.error("Error fetching app links:", error);
    throw error;
  }
}
