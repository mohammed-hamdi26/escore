"use server";
import apiClient from "./apiCLient";

/**
 * Get news with advanced filtering and sorting
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10, max: 100)
 * @param {string} params.search - Search in title
 * @param {string} params.category - Filter by category (news, announcement, interview, analysis, guide, review, opinion)
 * @param {string} params.game - Filter by game ID
 * @param {string} params.tournament - Filter by tournament ID
 * @param {string} params.team - Filter by team ID
 * @param {string} params.player - Filter by player ID
 * @param {string} params.tag - Filter by tag
 * @param {boolean|string} params.isPublished - Filter by publish status
 * @param {boolean|string} params.isFeatured - Filter by featured status
 * @param {boolean|string} params.isPinned - Filter by pinned status
 * @param {string} params.sortBy - Sort field (publishedAt, createdAt, viewsCount, likesCount, title)
 * @param {string} params.sortOrder - Sort direction (asc, desc)
 */
export async function getNews(params = {}) {
  const searchParamsString = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== "" && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  try {
    const res = await apiClient.get(`/news?${searchParamsString}`);
    return {
      data: res.data?.data || [],
      pagination: res.data?.meta || {
        totalPages: 1,
        total: res.data?.data?.length || 0,
        page: 1,
        limit: 10,
      },
    };
  } catch (e) {
    console.error("Error fetching news:", e);
    return {
      data: [],
      pagination: { totalPages: 1, total: 0, page: 1, limit: 10 },
    };
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
