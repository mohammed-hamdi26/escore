import apiClient from "./apiCLient";
export async function getPlayers(searchParams = {}) {
  const searchParamsString = Object.entries(searchParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  //
  try {
    const res = await apiClient.get(`/players?${searchParamsString}`);
    return res.data.data;
  } catch (e) {
    throw new Error("Failed to get players");
  }
}

export async function getPlayer(id) {
  try {
    const res = await apiClient.get(`/players/${id}`);
    return res.data.data;
  } catch (e) {
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
