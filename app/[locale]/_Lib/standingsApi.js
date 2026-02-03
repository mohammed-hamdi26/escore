import apiClient from "./apiCLient";

export async function getTournamentStandings(tournamentId) {
  try {
    const res = await apiClient.get(`/standings/tournament/${tournamentId}`);
    return res.data?.data || [];
  } catch (e) {
    console.log(e.response);
    // Return empty array instead of throwing - standings might not exist for all tournaments
    return [];
  }
}

export async function getGroupedStandings(tournamentId) {
  try {
    const res = await apiClient.get(`/standings/tournament/${tournamentId}/grouped`);
    return res.data?.data || {};
  } catch (e) {
    console.log(e.response);
    // Return empty object instead of throwing - grouped standings might not exist
    return {};
  }
}

export async function getTeamStanding(tournamentId, teamId) {
  try {
    const res = await apiClient.get(`/standings/tournament/${tournamentId}/team/${teamId}`);
    return res.data?.data || null;
  } catch (e) {
    console.log(e.response);
    return null;
  }
}
