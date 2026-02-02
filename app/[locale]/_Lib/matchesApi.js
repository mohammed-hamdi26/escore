import apiClient from "./apiCLient";

export async function getMatches(searchParams = {}) {
  try {
    const params = new URLSearchParams();

    // Add pagination params
    if (searchParams.page) params.set("page", searchParams.page);
    if (searchParams.size) params.set("limit", searchParams.size);

    // Add filter params
    if (searchParams.search) params.set("search", searchParams.search);
    if (searchParams.game) params.set("game", searchParams.game);
    if (searchParams.tournament) params.set("tournament", searchParams.tournament);
    if (searchParams.team) params.set("team", searchParams.team);
    if (searchParams.status) params.set("status", searchParams.status);
    if (searchParams.excludeStatus) params.set("excludeStatus", searchParams.excludeStatus);
    if (searchParams.date) params.set("date", searchParams.date);
    if (searchParams.dateFrom) params.set("dateFrom", searchParams.dateFrom);
    if (searchParams.dateTo) params.set("dateTo", searchParams.dateTo);
    if (searchParams.isFeatured !== undefined && searchParams.isFeatured !== "") {
      params.set("isFeatured", searchParams.isFeatured);
    }
    if (searchParams.isOnline !== undefined && searchParams.isOnline !== "") {
      params.set("isOnline", searchParams.isOnline);
    }

    // Add sort params
    if (searchParams.sortBy) params.set("sortBy", searchParams.sortBy);
    if (searchParams.sortOrder) params.set("sortOrder", searchParams.sortOrder);

    const queryString = params.toString();
    const url = queryString ? `/matches?${queryString}` : "/matches";

    const res = await apiClient.get(url);

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
    console.log(e.response);
    throw new Error("Failed to get matches");
  }
}

export async function getMatch(id) {
  try {
    const res = await apiClient.get(`/matches/${id}`);
    return res.data.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get match");
  }
}

export async function getMatchesCount() {
  try {
    const res = await apiClient.get(`/matches/count`);
    return res.data.data;
  } catch (e) {
    throw new Error("Failed to get matches count");
  }
}

export async function getLiveMatches(gameId = null) {
  try {
    const params = gameId ? `?game=${gameId}` : "";
    const res = await apiClient.get(`/matches/live${params}`);
    return res.data.data || [];
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get live matches");
  }
}

export async function getUpcomingMatches(limit = 10, gameId = null) {
  try {
    const params = new URLSearchParams();
    params.set("limit", limit);
    if (gameId) params.set("game", gameId);

    const res = await apiClient.get(`/matches/upcoming?${params.toString()}`);
    return res.data.data || [];
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get upcoming matches");
  }
}

export async function getMatchesByTournament(tournamentId, status = null) {
  try {
    const params = status ? `?status=${status}` : "";
    const res = await apiClient.get(`/matches/tournament/${tournamentId}${params}`);
    return res.data.data || [];
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get tournament matches");
  }
}

export async function getMatchesByTeam(teamId, searchParams = {}) {
  try {
    const params = new URLSearchParams();
    if (searchParams.status) params.set("status", searchParams.status);
    if (searchParams.page) params.set("page", searchParams.page);
    if (searchParams.limit) params.set("limit", searchParams.limit);

    const queryString = params.toString();
    const url = queryString
      ? `/matches/team/${teamId}?${queryString}`
      : `/matches/team/${teamId}`;

    const res = await apiClient.get(url);
    return {
      data: res.data?.data || [],
      pagination: res.data?.meta || {
        totalPages: 1,
        total: res.data?.data?.length || 0,
      },
    };
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get team matches");
  }
}

export async function getMatchesByDate(date, gameId = null) {
  try {
    const params = gameId ? `?game=${gameId}` : "";
    const res = await apiClient.get(`/matches/date/${date}${params}`);
    return res.data.data || [];
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get matches by date");
  }
}

export async function deleteMatch(id) {
  try {
    const res = await apiClient.delete(`/matches/${id}`);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to delete match");
  }
}

export async function toggleMatchFeatured(id) {
  try {
    const res = await apiClient.patch(`/matches/${id}/toggle-featured`);
    return res.data.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to toggle match featured");
  }
}
