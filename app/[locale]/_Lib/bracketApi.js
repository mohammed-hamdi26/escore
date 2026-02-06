import apiClient from "./apiCLient";

export async function getBracket(tournamentId) {
  try {
    const res = await apiClient.get(`/tournaments/${tournamentId}/bracket`);
    return res.data?.data;
  } catch (e) {
    // Return null if no bracket exists (404)
    if (e.response?.status === 404) return null;
    console.error("Error fetching bracket:", e);
    return null;
  }
}

export async function generateBracket(tournamentId, data) {
  try {
    const res = await apiClient.post(
      `/tournaments/${tournamentId}/bracket/generate`,
      data
    );
    return res.data?.data;
  } catch (e) {
    console.error("Error generating bracket:", e.response?.data || e.message);
    throw new Error(
      e.response?.data?.message || "Error generating bracket"
    );
  }
}

export async function deleteBracket(tournamentId) {
  try {
    const res = await apiClient.delete(
      `/tournaments/${tournamentId}/bracket`
    );
    return res.data;
  } catch (e) {
    console.error("Error deleting bracket:", e.response?.data || e.message);
    throw new Error(
      e.response?.data?.message || "Error deleting bracket"
    );
  }
}

export async function updateBracketSeeds(tournamentId, data) {
  try {
    const res = await apiClient.put(
      `/tournaments/${tournamentId}/bracket/seeds`,
      data
    );
    return res.data?.data;
  } catch (e) {
    console.error("Error updating seeds:", e.response?.data || e.message);
    throw new Error(
      e.response?.data?.message || "Error updating bracket seeds"
    );
  }
}
