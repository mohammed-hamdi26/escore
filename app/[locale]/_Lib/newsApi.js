"use server";
import apiClient from "./apiCLient";

export async function getNews(searchParams = {}) {
  const searchParamsString = Object.entries(searchParams)
    .filter(([, value]) => value !== undefined && value !== "" && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  try {
    const res = await apiClient.get(`/news?${searchParamsString}`);
    return res.data;
  } catch (e) {
    console.error("Error fetching news:", e);
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

export async function getNewsStats() {
  try {
    const [allNews, featuredNews, pinnedNews] = await Promise.all([
      apiClient.get("/news?limit=1"),
      apiClient.get("/news?isFeatured=true&limit=1"),
      apiClient.get("/news?isPinned=true&limit=1"),
    ]);

    return {
      total: allNews.data.pagination?.total || 0,
      featured: featuredNews.data.pagination?.total || 0,
      pinned: pinnedNews.data.pagination?.total || 0,
    };
  } catch (e) {
    console.error("Error fetching news stats:", e);
    return { total: 0, featured: 0, pinned: 0 };
  }
}

export async function toggleNewsFeatured(id) {
  try {
    const res = await apiClient.patch(`/news/${id}/toggle-featured`);
    return res.data.data;
  } catch (e) {
    console.error("Error toggling featured:", e);
    throw new Error("Failed to toggle featured status");
  }
}

export async function toggleNewsPinned(id) {
  try {
    const res = await apiClient.patch(`/news/${id}/toggle-pinned`);
    return res.data.data;
  } catch (e) {
    console.error("Error toggling pinned:", e);
    throw new Error("Failed to toggle pinned status");
  }
}

export async function publishNews(id) {
  try {
    const res = await apiClient.patch(`/news/${id}/publish`);
    return res.data.data;
  } catch (e) {
    console.error("Error publishing news:", e);
    throw new Error("Failed to publish news");
  }
}

export async function unpublishNews(id) {
  try {
    const res = await apiClient.patch(`/news/${id}/unpublish`);
    return res.data.data;
  } catch (e) {
    console.error("Error unpublishing news:", e);
    throw new Error("Failed to unpublish news");
  }
}
