"use server";
import apiClient from "./apiCLient";

export async function getNews(searchParams = {}) {
  const searchParamsString = Object.entries(searchParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  try {
    const res = await apiClient.get(`/news?${searchParamsString}`);
    return res.data.data;
  } catch (e) {
    throw new Error("Error in fetching news");
  }
}

export async function getNew(id) {
  try {
    const res = await apiClient.get(`/news/${id}`);
    return res.data.data;
  } catch (e) {
    throw new Error("Failed to get News");
  }
}

export async function getNewsCount() {
  try {
    const res = await apiClient.get(`/news/count`);
    return res.data.data;
  } catch (e) {
    throw new Error("Failed to get news count");
  }
}
