import apiClient from "./apiCLient";

export async function getAvatars() {
  try {
    const res = await apiClient.get("/avatars/admin", {
      params: { limit: 100 },
    });
    return res.data.data;
  } catch (error) {
    console.error("Error fetching avatars:", error);
    throw error;
  }
}
