import apiClient from "./apiCLient";

export async function getNews() {
  try {
    const res = await apiClient.get("/news");
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in fetching news");
  }
}
