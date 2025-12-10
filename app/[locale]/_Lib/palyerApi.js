import apiClient from "./apiCLient";
export async function getPlayers(searchParams = {}) {
  try {
    const params = new URLSearchParams();

    // Add pagination params
    if (searchParams.page) params.set("page", searchParams.page);
    if (searchParams.size) params.set("limit", searchParams.size);

    // Add search param
    if (searchParams.search) params.set("search", searchParams.search);

    const queryString = params.toString();
    const url = queryString ? `/players?${queryString}` : "/players";

    const res = await apiClient.get(url);

    return {
      data: res.data?.data,
      pagination: res.data?.pagination || {
        totalPages: 1,
        total: res.data?.data?.length || 0,
      },
    };
  } catch (e) {
    throw new Error("Failed to get players");
  }
}

export async function getPlayer(id) {
  console.log(id);
  try {
    const res = await apiClient.get(`/players/${id}`);
    return res.data.data;
  } catch (e) {
    // console.log(e.response);
    throw new Error("Failed to get players");
  }
}

export async function getPlayersCount() {
  try {
    const res = await apiClient.get(`/players/count`);
    return res.data.data;
  } catch (e) {
    throw new Error("Failed to get players count");
  }
}

export async function getPlayersLinks(id) {
  try {
    const res = await apiClient.get(`/players/${id}`);
    return res.data.data.socialLinks;
  } catch (e) {
    throw new Error("Failed to get players links");
  }
}

export async function getPlayersByTeam(teamId) {
  try {
    const res = await apiClient.get(`/players`, {
      params: { "team.id.equals": teamId },
    });
    return res.data.data;
  } catch (e) {
    throw new Error("Failed to get team players");
  }
}

export async function getPlayersAwards(id) {
  try {
    const res = await apiClient.get(`/players/${id}/awards`);
    return res.data.data;
  } catch (e) {
    throw new Error("Failed to get players awards");
  }
}

export async function getPlayersFavoriteCharacters(id) {
  try {
    const res = await apiClient.get(`/players/${id}/favourite-characters`);
    return res.data.data;
  } catch (e) {
    throw new Error("Failed to get players characters");
  }
}
