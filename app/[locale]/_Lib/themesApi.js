import apiClient from "./apiCLient";
export async function getAllThemes() {
  try {
    const res = await apiClient.get(`/settings/themes`);
    return res.data;
  } catch {
    throw new Error("error while fetcing themes");
  }
}
