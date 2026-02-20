import apiClient from "./apiCLient";

export async function getEvents(searchParams = {}) {
  try {
    const params = new URLSearchParams();
    if (searchParams.page) params.set("page", searchParams.page);
    if (searchParams.size) params.set("limit", searchParams.size);
    if (searchParams.search) params.set("search", searchParams.search);
    if (searchParams.status) params.set("status", searchParams.status);
    if (searchParams.isFeatured) params.set("isFeatured", searchParams.isFeatured);
    if (searchParams.sortBy) params.set("sortBy", searchParams.sortBy);
    if (searchParams.sortOrder) params.set("sortOrder", searchParams.sortOrder);

    const queryString = params.toString();
    const url = queryString ? `/events?${queryString}` : "/events";
    const res = await apiClient.get(url);

    return {
      data: res.data?.data || [],
      pagination: res.data?.meta || {
        totalPages: 1,
        total: 0,
        page: 1,
        limit: 10,
      },
    };
  } catch (e) {
    console.error("Error fetching events:", e);
    return {
      data: [],
      pagination: { totalPages: 1, total: 0, page: 1, limit: 10 },
    };
  }
}

export async function getEvent(id) {
  try {
    const res = await apiClient.get(`/events/${id}`);
    return res.data.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get event");
  }
}

export async function getEventTournaments(eventId, params = {}) {
  try {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page);
    if (params.size) searchParams.set("limit", params.size || "100");

    const queryString = searchParams.toString();
    const url = queryString
      ? `/events/${eventId}/tournaments?${queryString}`
      : `/events/${eventId}/tournaments`;
    const res = await apiClient.get(url);

    return {
      data: res.data?.data || [],
      pagination: res.data?.meta || {
        totalPages: 1,
        total: 0,
        page: 1,
        limit: 100,
      },
    };
  } catch (e) {
    console.error("Error fetching event tournaments:", e);
    return {
      data: [],
      pagination: { totalPages: 1, total: 0, page: 1, limit: 100 },
    };
  }
}

export async function getEventClubs(eventId) {
  try {
    const res = await apiClient.get(`/events/${eventId}/clubs`);
    return res.data?.data || [];
  } catch (e) {
    console.error("Error fetching event clubs:", e);
    return [];
  }
}

export async function getEventStandings(eventId, params = {}) {
  try {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set("limit", params.limit);
    if (params.eligibleOnly) searchParams.set("eligibleOnly", "true");

    const queryString = searchParams.toString();
    const url = queryString
      ? `/events/${eventId}/standings?${queryString}`
      : `/events/${eventId}/standings`;
    const res = await apiClient.get(url);

    return {
      data: res.data?.data || [],
      pagination: res.data?.meta || {
        totalPages: 1,
        total: 0,
        page: 1,
        limit: 50,
      },
    };
  } catch (e) {
    console.error("Error fetching event standings:", e);
    return {
      data: [],
      pagination: { totalPages: 1, total: 0, page: 1, limit: 50 },
    };
  }
}

export async function getEventLinks(id) {
  try {
    const res = await apiClient.get(`/events/${id}`);
    return res.data?.data?.socialLinks || [];
  } catch (e) {
    console.error("Error fetching event links:", e);
    return [];
  }
}

export async function getClubStandingDetail(eventId, clubId) {
  try {
    const res = await apiClient.get(
      `/events/${eventId}/standings/${clubId}`
    );
    return res.data.data;
  } catch (e) {
    console.error("Error fetching club standing detail:", e);
    return null;
  }
}
