import apiClient from "./apiCLient";
export async function getAllThemes() {
  try {
    const res = await apiClient.get(`/v1/themes`);
    return res.data;
  } catch {
    throw new Error("error while fetcing themes");
  }
}
