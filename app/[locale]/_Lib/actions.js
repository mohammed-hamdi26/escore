"use server";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import apiClient from "./apiCLient";

import { deleteSession, saveSession, saveRefreshToken } from "./session";
import { redirect } from "next/navigation";
import { getPlayers, getPlayersLinks } from "./palyerApi";
import { getAwardsTeam, getTeamsLinks, getTeams } from "./teamsApi";
import { getGames } from "./gamesApi";
import { getTournamentLinks, getTournaments } from "./tournamentsApi";

// login
export async function login(userData) {
  try {
    const res = await apiClient.post("/auth/login", userData);

    const tokens = res?.data?.data?.tokens;
    await saveSession(tokens?.accessToken);
    await saveRefreshToken(tokens?.refreshToken);
  } catch (e) {
    console.log(e.response.data.errors || e.response.data || e.response || e);
    throw new Error("Error in login");
  }
  redirect("/dashboard");
}
export async function register(userData) {
  try {
    // Format the data for the backend
    const registerData = {
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
    };

    // Add avatar if provided
    if (userData.avatar) {
      registerData.avatar = { light: userData.avatar };
    }

    await apiClient.post("/auth/register", registerData);
    return { success: true };
  } catch (e) {
    console.log("Register error:", e.response?.data);
    return {
      success: false,
      error:
        e.response?.data?.message ||
        "Registration failed. Email may already exist.",
    };
  }
}
export async function verifyAccount(email, otp) {
  try {
    await apiClient.post("/auth/verify-email", { email, otp });
    return { success: true };
  } catch (e) {
    console.log("Verify error:", e.response?.data);
    return {
      success: false,
      error: e.response?.data?.message || "Invalid or expired code",
    };
  }
}
export async function logout() {
  await deleteSession();
  redirect("/login");
}

// Force clear session without redirect (for error handling)
export async function forceLogout() {
  try {
    await deleteSession();
    return { success: true };
  } catch (e) {
    console.error("Force logout error:", e);
    return { success: false };
  }
}

// Search actions for paginated select fields (called from client components)
export async function searchTeams({ search = "", page = 1, limit = 15 } = {}) {
  return getTeams({ search, page, size: limit });
}

export async function searchGames({ search = "", page = 1, limit = 15 } = {}) {
  return getGames({ search, page, size: limit });
}

export async function searchPlayers({ search = "", page = 1, limit = 15 } = {}) {
  return getPlayers({ search, page, size: limit });
}

export async function searchTournaments({ search = "", page = 1, limit = 15 } = {}) {
  return getTournaments({ search, page, size: limit });
}

// Helper function to clean null/undefined values from data
function cleanNullValues(data) {
  return Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== null && v !== undefined && v !== "")
  );
}

// player actions
export async function addPlayer(playerData) {
  const locale = await getLocale();
  try {
    const cleanData = cleanNullValues(playerData);
    const res = await apiClient.post("/players", cleanData);
    console.log("add player", res);
    revalidatePath(`/${locale}/dashboard/player-management`);
  } catch (e) {
    console.log("Player creation error:", e.response?.data || e.message);
    throw new Error(e.response?.data?.message || "Error in adding player");
  }
  redirect(`/${locale}/dashboard/player-management`);
}
export async function editPlayer(playerData) {
  const locale = await getLocale();
  try {
    const cleanData = cleanNullValues(playerData);
    const res = await apiClient.put(`/players/${cleanData.id}`, cleanData);
    revalidatePath(
      `${locale}/dashboard/player-management/edit/${cleanData.id}`
    );
  } catch (e) {
    console.log("Player update error:", e.response?.data || e.message);
    throw new Error(e.response?.data?.message || "Error in updating player");
  }
  redirect(`/${locale}/dashboard/player-management`);
}

export async function fetchPlayersByTeam(teamId) {
  try {
    // Use the correct endpoint to get players by team
    const res = await apiClient.get(`/players/team/${teamId}`);
    return res.data.data;
  } catch (e) {
    console.log(
      e.response?.data?.errors || e.response?.data || e.response || e
    );
    throw new Error("Failed to get team players");
  }
}

export async function deletePlayer(id) {
  const locale = await getLocale();

  try {
    const res = await apiClient.delete(`/players/${id}`);
    revalidatePath(`${locale}/dashboard/player-management`);
    return res.data;
  } catch (e) {
    throw new Error("error in Delete");
  }
}
// games actions
export async function addGame(gameData) {
  const locale = await getLocale();
  try {
    const cleanData = cleanNullValues(gameData);
    const res = await apiClient.post("/games", cleanData);
  } catch (e) {
    console.log("Game creation error:", e.response?.data || e.message);
    throw new Error(e.response?.data?.message || "Error in adding game");
  }
  redirect(`/${locale}/dashboard/games-management`);
}

export async function updateGame(gameData) {
  const locale = await getLocale();
  try {
    const cleanData = cleanNullValues(gameData);
    const res = await apiClient.put(`/games/${cleanData.id}`, cleanData);
    revalidatePath(`/${locale}/dashboard/games-management/edit/${cleanData.id}`);
  } catch (e) {
    console.log("Game update error:", e.response?.data || e.message);
    throw new Error(e.response?.data?.message || "Error in updating game");
  }
  redirect(`/${locale}/dashboard/games-management`);
}
export async function deleteGame(id) {
  const locale = await getLocale();

  try {
    const res = await apiClient.delete(`/games/${id}`);
    revalidatePath(`/${locale}/dashboard/games-management`);
    return res.data;
  } catch (e) {
    throw new Error("error in Delete");
  }
}

export async function toggleGameActive(id) {
  const locale = await getLocale();

  try {
    const res = await apiClient.patch(`/games/${id}/toggle-active`);
    revalidatePath(`/${locale}/dashboard/games-management`);
    return res.data;
  } catch (e) {
    throw new Error("Error toggling game active status");
  }
}

// Teams Actions
export async function addTeam(teamData) {
  const locale = await getLocale();
  try {
    const cleanData = cleanNullValues(teamData);
    const res = await apiClient.post("/teams", cleanData);
  } catch (e) {
    console.log("Team creation error:", e.response?.data || e.message);
    throw new Error(e.response?.data?.message || "Error in adding team");
  }
  redirect(`/${locale}/dashboard/teams-management`);
}

export async function updateTeam(teamData) {
  const locale = await getLocale();

  try {
    const cleanData = cleanNullValues(teamData);
    const res = await apiClient.put(`/teams/${cleanData.id}`, cleanData);
    revalidatePath(`/${locale}/dashboard/teams-management/edit/${cleanData.id}`);
  } catch (e) {
    console.log("Team update error:", e.response?.data || e.message);
    throw new Error(e.response?.data?.message || "Error in updating team");
  }
  redirect(`/${locale}/dashboard/teams-management`);
}
export async function deleteTeam(id) {
  const locale = await getLocale();

  try {
    const res = await apiClient.delete(`/teams/${id}`);
    revalidatePath(`/${locale}/dashboard/teams-management/edit`);
    return res.data;
  } catch (e) {
    throw new Error("error in Delete");
  }
}

export async function removePlayerFromTeam(playerId, teamId) {
  const locale = await getLocale();

  try {
    const res = await apiClient.patch(`/players/${playerId}`, {
      team: null,
      isFreeAgent: true,
    });
    revalidatePath(`/${locale}/dashboard/teams-management/lineups/${teamId}`);
    return res.data;
  } catch (e) {
    console.log(e.response?.data?.errors || e.response?.data || e.response || e);
    throw new Error("Failed to remove player from team");
  }
}

// News Actions
export async function addNews(newsData) {
  const locale = await getLocale();
  try {
    const cleanData = cleanNullValues(newsData);
    const newsDataWithDate = {
      ...cleanData,
      publishDate:
        cleanData.status === "PUBLISHED"
          ? new Date().toISOString()
          : cleanData.publishDate,
    };
    const res = await apiClient.post("/news", newsDataWithDate);
  } catch (e) {
    console.log("News creation error:", e.response?.data || e.message);
    throw new Error(e.response?.data?.message || "Error in adding news");
  }
  redirect(`/${locale}/dashboard/news-management`);
}

export async function editNews(newsData) {
  const locale = await getLocale();
  try {
    const cleanData = cleanNullValues(newsData);
    const res = await apiClient.put(`/news/${cleanData.id}`, cleanData);
    revalidatePath(`/${locale}/dashboard/news/edit/${cleanData.id}`);
  } catch (e) {
    console.log("News update error:", e.response?.data || e.message);
    throw new Error(e.response?.data?.message || "Error in updating news");
  }
  redirect(`/${locale}/dashboard/news-management`);
}
export async function deleteNew(id) {
  const locale = await getLocale();

  try {
    const res = await apiClient.delete(`/news/${id}`);
    revalidatePath(`/${locale}/dashboard/news/edit`);
    return res.data;
  } catch (e) {
    throw new Error("error in Delete");
  }
}

export async function uploadPhoto(formData, imageType = null) {
  try {
    // Build URL with optional imageType query param
    const url = imageType
      ? `/upload/image?imageType=${imageType}`
      : "/upload/image";

    const res = await apiClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Return the URL (large size if available, otherwise single url)
    const uploadedUrl = res.data?.data?.url;
    if (!uploadedUrl) {
      console.error("Upload response missing URL:", res.data);
      throw new Error("Upload succeeded but no URL returned");
    }
    return uploadedUrl;
  } catch (e) {
    console.error("Upload error details:", {
      message: e.message,
      response: e.response?.data,
      status: e.response?.status,
    });
    throw new Error(e.response?.data?.message || e.message || "Error in upload");
  }
}

// tournaments

export async function addTournament(tournamentData) {
  const locale = await getLocale();
  try {
    const cleanData = cleanNullValues(tournamentData);
    // Remove status field for create (only allowed in update)
    delete cleanData.status;

    const res = await apiClient.post("/tournaments", cleanData);
  } catch (e) {
    console.log("Tournament creation error:", e.response?.data || e.message);
    throw new Error(e.response?.data?.message || "Error in adding tournament");
  }
  redirect(`/${locale}/dashboard/tournaments-management`);
}

export async function editTournament(tournamentData) {
  const locale = await getLocale();
  try {
    const cleanData = cleanNullValues(tournamentData);
    const res = await apiClient.put(
      `/tournaments/${cleanData.id}`,
      cleanData
    );
    revalidatePath(
      `/${locale}/dashboard/tournaments/edit/${cleanData.id}`
    );
  } catch (e) {
    console.log("Tournament update error:", e.response?.data || e.message);
    throw new Error(e.response?.data?.message || "Error in updating tournaments");
  }
  redirect(`/${locale}/dashboard/tournaments-management`);
}
export async function deleteTournament(id) {
  const locale = await getLocale();

  try {
    const res = await apiClient.delete(`/tournaments/${id}`);
    revalidatePath(`/${locale}/dashboard/tournaments/edit`);
    return res.data;
  } catch (e) {
    throw new Error("error in Delete tournament");
  }
}

export async function toggleTournamentFeatured(id) {
  const locale = await getLocale();

  try {
    const res = await apiClient.patch(`/tournaments/${id}/toggle-featured`);
    revalidatePath(`/${locale}/dashboard/tournaments-management`);
    return res.data;
  } catch (e) {
    throw new Error("Error toggling tournament featured status");
  }
}

// matches

export async function addMatch(matchData) {
  try {
    const cleanData = cleanNullValues(matchData);
    const res = await apiClient.post("/matches", cleanData);
    return res.data;
  } catch (e) {
    console.log("Match creation error:", e.response?.data || e.message);
    throw new Error(e.response?.data?.message || "Error in adding match");
  }
}

export async function updateMatch(matchData) {
  const locale = await getLocale();
  try {
    const cleanData = cleanNullValues(matchData);
    console.log("Sending match data:", JSON.stringify(cleanData, null, 2));
    const res = await apiClient.put(`/matches/${cleanData.id}`, cleanData);
    revalidatePath(
      `/${locale}/dashboard/matches-management/edit/${cleanData.id}`
    );
    return res.data;
  } catch (e) {
    console.log("Match update error:", e.response?.data || e.message);
    throw new Error(e.response?.data?.message || "Error in updating match");
  }
}
export async function deleteMatch(id) {
  const locale = await getLocale();

  try {
    const res = await apiClient.delete(`/matches/${id}`);
    revalidatePath(`/${locale}/dashboard/matches-management/edit`);
    return res.data;
  } catch (e) {
    throw new Error("error in Delete");
  }
}

// Start a match (scheduled -> live)
export async function startMatch(id) {
  const locale = await getLocale();

  try {
    const res = await apiClient.patch(`/matches/${id}/start`);
    revalidatePath(`/${locale}/dashboard/matches-management/edit`);
    return res.data;
  } catch (e) {
    console.log("Error starting match:", e.response?.data);
    throw new Error(e.response?.data?.message || "Error starting match");
  }
}

// End a match with result
export async function endMatch(id, result) {
  const locale = await getLocale();

  try {
    const res = await apiClient.patch(`/matches/${id}/end`, result);
    revalidatePath(`/${locale}/dashboard/matches-management/edit`);
    return res.data;
  } catch (e) {
    console.log("Error ending match:", e.response?.data);
    throw new Error(e.response?.data?.message || "Error ending match");
  }
}

// Update match result (for live score updates)
export async function updateMatchResult(id, result) {
  const locale = await getLocale();

  try {
    const res = await apiClient.patch(`/matches/${id}/result`, result);
    revalidatePath(`/${locale}/dashboard/matches-management`);
    revalidatePath(`/${locale}/dashboard/matches-management/view/${id}`);
    return res.data;
  } catch (e) {
    console.log("Error updating match result:", e.response?.data);
    throw new Error(e.response?.data?.message || "Error updating match result");
  }
}

// Update match status
export async function updateMatchStatus(id, status) {
  const locale = await getLocale();

  try {
    const res = await apiClient.patch(`/matches/${id}/status`, { status });
    revalidatePath(`/${locale}/dashboard/matches-management/edit`);
    return res.data;
  } catch (e) {
    console.log("Error updating match status:", e.response?.data);
    throw new Error(e.response?.data?.message || "Error updating match status");
  }
}

// Toggle featured status
export async function toggleMatchFeatured(id) {
  const locale = await getLocale();

  try {
    const res = await apiClient.patch(`/matches/${id}/toggle-featured`);
    revalidatePath(`/${locale}/dashboard/matches-management/edit`);
    return res.data;
  } catch (e) {
    console.log("Error toggling featured:", e.response?.data);
    throw new Error(
      e.response?.data?.message || "Error toggling featured status"
    );
  }
}

export async function setMatchLineup(matchId, teamId, players) {
  const locale = await getLocale();

  try {
    const res = await apiClient.post(`/matches/${matchId}/lineup`, {
      team: teamId,
      players: players,
    });
    revalidatePath(`/${locale}/dashboard/matches-management/edit`);
    return res.data;
  } catch (e) {
    console.log("Error setting lineup:", e.response?.data);
    throw new Error(e.response?.data?.message || "Error setting match lineup");
  }
}

export async function removeMatchLineup(matchId, teamId) {
  const locale = await getLocale();

  try {
    const res = await apiClient.delete(`/matches/${matchId}/lineup/${teamId}`);
    revalidatePath(`/${locale}/dashboard/matches-management/edit`);
    return res.data;
  } catch (e) {
    console.log("Error removing lineup:", e.response?.data);
    throw new Error(e.response?.data?.message || "Error removing match lineup");
  }
}

export async function addLink(linkData) {
  const locale = await getLocale();
  try {
    const res = await apiClient.post("/social-links", linkData);
  } catch (e) {
    throw new Error("Error in adding link");
  }
  revalidatePath(
    `/${locale}/dashboard/links/edit/${linkData.player.id || linkData.team.id}`
  );
}

export async function updateLink(linkData) {
  console.log(linkData);
  const locale = await getLocale();
  try {
    const res = await apiClient.put(`/social-links/${linkData.id}`, linkData);
    revalidatePath(
      `/${locale}/dashboard/links/edit/${
        linkData.player.id || linkData.team.id
      }`
    );
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in updating link");
  }
}

// export async function deleteLink(id, idUser) {
//   const locale = await getLocale();
//   try {
//     const res = await apiClient.delete(`/social-links/${id}`);
//     // return res.data;
//   } catch (error) {
//     console.log("Failed to delete link", error);
//     throw error;
//   } finally {
//   }
//   revalidatePath(`/${locale}/dashboard/links/edit/${idUser}`);
// }

// langues

export async function addLanguage(language_data) {
  console.log(language_data);
  try {
    const response = await apiClient.post(
      `/settings/languages`,
      language_data
    );
    console.log("Language added:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to add language:", error);
    throw error;
  }
}

export async function updateLanguage(code, language_data) {
  try {
    const response = await apiClient.patch(
      `/settings/languages/${code}`,
      language_data
    );
    console.log("Language updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update language:", error);
    throw error;
  }
}
export async function deleteLanguage(code) {
  try {
    const response = await apiClient.delete(`/settings/languages/${code}`);

    return response.data;
  } catch (error) {
    console.error("Failed to delete language:", error);
    throw error;
  }
}

// dictionary
export async function addToDictionary(code, { word, translation }) {
  try {
    const response = await apiClient.post(
      `/settings/languages/${code}/dictionary`,
      {
        word,
        translation,
      }
    );
    console.log("Word added:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to add word:", error);
    throw error;
  }
}

export async function updateWord(code, word, translation) {
  try {
    const response = await apiClient.put(
      `/settings/languages/${code}/dictionary/${word}`,
      { translation }
    );
    console.log("Word translation updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update word translation", error.response.data);
    throw error;
  }
}
export async function deleteWord(code, word) {
  try {
    const response = await apiClient.delete(
      `/settings/languages/${code}/dictionary/${word}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete word:", error);
    throw error;
  }
}

// about

export async function addAboutContent(language_code, content) {
  try {
    const res = await apiClient.post(
      `/settings/about-app`,
      { languageCode: language_code, content: content },
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteAboutContent(language_code) {
  try {
    const res = await apiClient.delete(`/settings/about-app/${language_code}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function updateAboutContent(language_code, content) {
  try {
    const res = await apiClient.patch(
      `/settings/about-app/${language_code}`,
      { languageCode: language_code, content: content },
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error.response.data.errors || error.response.data || error);
    throw error;
  }
}

export async function getAboutContent(language_code) {
  try {
    const res = await apiClient.get(`/settings/about-app/${language_code}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

// privacy content
export async function getPrivacyContent(language_code) {
  try {
    const res = await apiClient.get(`/settings/privacy/${language_code}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    return res.data;
  } catch (error) {
    console.log("Failed to get language privacy and policy", error);
    throw error;
  }
}
export async function addPrivacyContent(language_code, content) {
  try {
    const res = await apiClient.post(
      `/settings/privacy`,
      { languageCode: language_code, content: content },
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to add language privacy and policy", error);
    throw error;
  }
}

export async function deletePrivacyContent(language_code) {
  try {
    const res = await apiClient.delete(`/settings/privacy/${language_code}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to get language privacy and policy", error);
    throw error;
  }
}

export async function updatePrivacyContent(language_code, content) {
  try {
    const res = await apiClient.put(
      `/settings/privacy/${language_code}`,
      { languageCode: language_code, content: content },
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    console.log(res.data);
    return res.data;
    // console.log(res.data);
  } catch (error) {
    console.log(error.response.data.errors || error.response.data || error);
    console.log("Failed to get language privacy and policy", error);
    throw error;
  }
}

export async function addTheme(theme) {
  try {
    const res = await apiClient.post(`/settings/themes`, theme);
    console.log("theme added", res.data);
    return res.data;
  } catch (error) {
    console.log(error.response.data.errors || error.response.data || error);
    console.log("Failed to add theme", error);
    throw error;
  }
}
export async function updateTheme(theme, theme_id) {
  try {
    const res = await apiClient.put(`/settings/themes/${theme_id}`, theme);
    console.log("theme updated", res.data);
    return res.data;
  } catch (error) {
    console.log(error.response.data.errors || error.response.data || error);

    // console.log("Failed to add theme", error);
    throw error;
  }
}
export async function deleteTheme(theme_id) {
  try {
    const res = await apiClient.delete(`/settings/themes/${theme_id}`);
    console.log("theme deleted", res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to add theme", error);
    throw error;
  }
}

// Add reply to ticket
export async function addTicketReply(id, message) {
  const locale = await getLocale();
  try {
    const res = await apiClient.post(`/support/tickets/${id}/reply`, {
      message,
    });
    revalidatePath(`/${locale}/dashboard/support-center`);
    return { success: true, data: res.data?.data };
  } catch (error) {
    console.log("Failed to add reply:", error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add reply",
    };
  }
}

// Update ticket (status, priority, assignedTo)
export async function updateTicket(id, data) {
  const locale = await getLocale();
  try {
    const res = await apiClient.patch(`/support/admin/tickets/${id}`, data);
    revalidatePath(`/${locale}/dashboard/support-center`);
    return { success: true, data: res.data?.data };
  } catch (error) {
    console.log("Failed to update ticket:", error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update ticket",
    };
  }
}

// Close ticket
export async function closeTicket(id) {
  const locale = await getLocale();
  try {
    const res = await apiClient.patch(`/support/tickets/${id}/close`);
    revalidatePath(`/${locale}/dashboard/support-center`);
    return { success: true, data: res.data?.data };
  } catch (error) {
    console.log("Failed to close ticket:", error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to close ticket",
    };
  }
}

// Reopen ticket
export async function reopenTicket(id) {
  const locale = await getLocale();
  try {
    const res = await apiClient.patch(`/support/tickets/${id}/reopen`);
    revalidatePath(`/${locale}/dashboard/support-center`);
    return { success: true, data: res.data?.data };
  } catch (error) {
    console.log("Failed to reopen ticket:", error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to reopen ticket",
    };
  }
}

// Delete ticket (admin only)
export async function deleteSupportTicket(id) {
  const locale = await getLocale();
  try {
    await apiClient.delete(`/support/admin/tickets/${id}`);
    revalidatePath(`/${locale}/dashboard/support-center`);
    return { success: true };
  } catch (error) {
    console.log("Failed to delete ticket:", error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete ticket",
    };
  }
}

// Get ticket by ID (for client components)
export async function getTicketByIdAction(id) {
  try {
    const res = await apiClient.get(`/support/tickets/${id}`);
    return { success: true, data: res.data?.data };
  } catch (error) {
    console.log("Failed to get ticket:", error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get ticket",
    };
  }
}

export async function addLineUp(data) {
  try {
    const res = await apiClient.post(`/lineups`, data);

    return res.data;
  } catch (error) {
    console.log("Failed to add lineup", error);
    throw error;
  }
}

// password change

export async function changePassword(data) {
  console.log(data);
  try {
    const res = await apiClient.put(`/users/change-password`, data);
    return res.data;
  } catch (error) {
    console.log(error.response.data.errors || error.response.data || error);
    // console.log("Failed to change password", error.response);
    throw error;
  }
}

export async function addAppSocialLink(data) {
  const locale = await getLocale();
  try {
    const res = await apiClient.post(`/settings/social-links`, data);
    revalidatePath(`/${locale}/dashboard/settings/links`);
    return res.data;
  } catch (error) {
    // console.log("Failed to add social link", error.response);
    throw error;
  }
}

export async function updateAppSocialLink(data) {
  const locale = await getLocale();
  console.log(data);
  try {
    const res = await apiClient.put(`/settings/social-links/${data.id}`, data);
    revalidatePath(`/${locale}/dashboard/settings/links`);
    return res.data;
  } catch (error) {
    console.log(error.response.data.errors || error.response.data || error);
    // console.log("Failed to add social link", error.response);
    throw error;
  }
}

export async function deleteAppSocialLink(id) {
  const locale = await getLocale();
  try {
    const res = await apiClient.delete(`/settings/social-links/${id}`);
    revalidatePath(`/${locale}/dashboard/settings/links`);
    return res.data;
  } catch (error) {
    // console.log("Failed to add social link", error.response);
    throw error;
  }
}

// avatars

export async function addAvatar(data) {
  const locale = await getLocale();
  try {
    const res = await apiClient.post(`/avatars`, data);
    revalidatePath(`/${locale}/dashboard/settings/avatars`);
    return res.data;
  } catch (error) {
    console.log(error.response?.data?.errors || error.response?.data || error);
    throw error;
  }
}

export async function updateAvatar(data) {
  const locale = await getLocale();
  try {
    const { id, ...updateData } = data;
    const res = await apiClient.put(`/avatars/${id}`, updateData);
    revalidatePath(`/${locale}/dashboard/settings/avatars`);
    return res.data;
  } catch (error) {
    console.log(error.response?.data?.errors || error.response?.data || error);
    throw error;
  }
}

export async function deleteAvatar(id) {
  const locale = await getLocale();
  try {
    const res = await apiClient.delete(`/avatars/${id}`);
    revalidatePath(`/${locale}/dashboard/settings/avatars`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function toggleAvatarStatus(id) {
  const locale = await getLocale();
  try {
    const res = await apiClient.patch(`/avatars/${id}/toggle-status`);
    revalidatePath(`/${locale}/dashboard/settings/avatars`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

// transfers

export async function addTransfer(data) {
  const locale = await getLocale();
  try {
    const res = await apiClient.post(`/transfers`, data);
    revalidatePath(`/${locale}/dashboard/transfers-management`);
    return { success: true, data: res.data.data };
  } catch (error) {
    console.error("Failed to add transfer:", error.response?.data || error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add transfer",
    };
  }
}

export async function editTransfer(data) {
  const locale = await getLocale();
  try {
    const res = await apiClient.put(`/transfers/${data.id}`, data);
    revalidatePath(`/${locale}/dashboard/transfers-management`);
    revalidatePath(`/${locale}/dashboard/transfers-management/edit/${data.id}`);
    return { success: true, data: res.data.data };
  } catch (error) {
    console.error("Failed to edit transfer:", error.response?.data || error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to edit transfer",
    };
  }
}

export async function deleteTransfer(id) {
  const locale = await getLocale();
  try {
    await apiClient.delete(`/transfers/${id}`);
    revalidatePath(`/${locale}/dashboard/transfers-management`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete transfer:", error.response?.data || error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete transfer",
    };
  }
}

export async function getTransferByIdAction(id) {
  try {
    const res = await apiClient.get(`/transfers/${id}`);
    return { success: true, data: res.data.data };
  } catch (error) {
    console.error("Failed to get transfer:", error.response?.data || error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get transfer",
    };
  }
}

export async function toggleTransferFeatured(id) {
  const locale = await getLocale();
  try {
    // Get current transfer to check featured status
    const getRes = await apiClient.get(`/transfers/${id}`);
    const currentFeatured = getRes.data.data.isFeatured;

    // Toggle the featured status
    const res = await apiClient.put(`/transfers/${id}`, {
      isFeatured: !currentFeatured,
    });

    revalidatePath(`/${locale}/dashboard/transfers-management`);
    revalidatePath(`/${locale}/dashboard/transfers-management/view/${id}`);
    return { success: true, data: res.data.data };
  } catch (error) {
    console.error("Failed to toggle transfer featured:", error.response?.data || error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to toggle featured status",
    };
  }
}

export async function addUser(data) {
  const locale = await getLocale();
  try {
    const res = await apiClient.post(`/admin/users`, data);
    return res.data.data;
  } catch (error) {
    console.log(error.response.data.errors || error.response.data || error);
    console.log("Failed to add user", error);
    throw error;
  }
  // redirect(`/${locale}/dashboard/users`);
}

export async function editUser(data) {
  const locale = await getLocale();
  try {
    // Update user basic info (role, isVerified)
    const userUpdateData = {};
    if (data.role) userUpdateData.role = data.role;
    if (data.isVerified !== undefined)
      userUpdateData.isVerified = data.isVerified;

    if (Object.keys(userUpdateData).length > 0) {
      await apiClient.patch(`/admin/users/${data.id}`, userUpdateData);
    }

    // Update permissions if they exist
    if (data.permissions && Array.isArray(data.permissions)) {
      await apiClient.put(`/admin/users/${data.id}/permissions`, {
        permissions: data.permissions,
      });
    }

    revalidatePath(`/${locale}/dashboard/users`);
    revalidatePath(`/${locale}/dashboard/users/${data.id}/edit`);
  } catch (error) {
    console.log(error.response?.data?.errors || error.response?.data || error);
    console.log("Failed to edit user", error);
    throw error;
  }
  redirect(`/${locale}/dashboard/users/list`);
}
export async function deleteUser(id) {
  const locale = await getLocale();
  try {
    const res = await apiClient.delete(`/admin/users/${id}`);
    revalidatePath(`/${locale}/dashboard/users`);
    // return res.data;
  } catch (error) {
    console.log("Failed to delete user", error);
    throw error;
  }
}

export async function resetUserPassword(userId) {
  const locale = await getLocale();
  try {
    const res = await apiClient.post(`/admin/users/${userId}/reset-password`);
    revalidatePath(`/${locale}/dashboard/users`);
    return { success: true, data: res.data.data };
  } catch (error) {
    console.log("Failed to reset password", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to reset password",
    };
  }
}

export async function forgotPassword(email) {
  try {
    const res = await apiClient.post("/auth/forgot-password", { email });
    return { success: true, data: res.data };
  } catch (error) {
    console.log("Failed to send reset email", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to send reset email",
    };
  }
}

export async function resetPassword(email, otp, newPassword) {
  try {
    const res = await apiClient.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.log("Failed to reset password", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to reset password",
    };
  }
}

export async function resendOTP(email, type) {
  try {
    const res = await apiClient.post("/auth/resend-otp", { email, type });
    return { success: true, data: res.data };
  } catch (error) {
    console.log("Failed to resend OTP", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to resend OTP",
    };
  }
}

export async function addAward(typeEdit, id, data) {
  const locale = await getLocale();
  console.log(typeEdit, id, data);

  try {
    const res = await apiClient.post(`/${typeEdit}/${id}/awards`, data);
    revalidatePath(
      `${locale}/dashboard/${
        typeEdit === "players" ? "player-management" : "teams-management"
      }/awards/${id}`
    );
    return res.data;
  } catch (e) {
    console.log(e.response.data.errors || e.response.data || e.response || e);
    throw new Error("Error in updating player");
  }
}
export async function editAward(typeEdit, id, data) {
  const locale = await getLocale();
  try {
    const res = await apiClient.put(
      `/${typeEdit}/${id}/awards/${data.id}`,
      data
    );
    revalidatePath(
      `${locale}/dashboard/${
        typeEdit === "players" ? "player-management" : "teams-management"
      }/awards/${id}`
    );
    return res.data;
  } catch (e) {
    console.log(e.response.data.errors || e.response.data || e.response || e);
    throw new Error("Error in updating player");
  }
}

export async function deleteAward(typeEdit, id, awardId) {
  const locale = await getLocale();
  try {
    const res = await apiClient.delete(`/${typeEdit}/${id}/awards/${awardId}`);
    revalidatePath(
      `${locale}/dashboard/${
        typeEdit === "players" ? "player-management" : "teams-management"
      }/awards/${id}`
    );
    return res.data;
  } catch (e) {
    console.log(e.response.data.errors || e.response.data || e.response || e);
    throw new Error("Error in deleting player");
  }
}

export async function addFavoriteCharacter(typeEdit, id, data) {
  const locale = await getLocale();
  console.log(typeEdit, id, data);
  try {
    const res = await apiClient.post(
      `/${typeEdit}/${id}/favourite-characters`,
      data
    );
    revalidatePath(
      `${locale}/dashboard/${
        typeEdit === "players" ? "player-management" : "teams-management"
      }/favorite-characters/${id}`
    );
    return res.data;
  } catch (e) {
    console.log(e.response.data.errors || e.response.data || e.response || e);
    throw new Error("Error in updating player");
  }
}
export async function editFavoriteCharacter(typeEdit, id, data) {
  const locale = await getLocale();
  try {
    const res = await apiClient.put(
      `/${typeEdit}/${id}/favourite-characters/${data.id}`,
      data
    );
    revalidatePath(
      `${locale}/dashboard/${
        typeEdit === "players" ? "player-management" : "teams-management"
      }/favorite-characters/${id}`
    );
    return res.data;
  } catch (e) {
    console.log(e.response.data.errors || e.response.data || e.response || e);
    throw new Error("Error in updating player");
  }
}

export async function deleteFavoriteCharacter(typeEdit, id, characterId) {
  const locale = await getLocale();

  console.log(typeEdit, id, characterId);
  try {
    const res = await apiClient.delete(
      `/${typeEdit}/${id}/favourite-characters/${characterId}`
    );
    revalidatePath(
      `${locale}/dashboard/${
        typeEdit === "players" ? "player-management" : "teams-management"
      }/favorite-characters/${id}`
    );
    return res.data;
  } catch (e) {
    console.log(e.response.data.errors || e.response.data || e.response || e);
    throw new Error("Error in deleting player");
  }
}
export async function addLinks(typeEdit, id, data) {}

// brackets
export async function getBracketAction(tournamentId) {
  try {
    const res = await apiClient.get(
      `/tournaments/${tournamentId}/bracket`
    );
    return { success: true, data: res.data?.data };
  } catch (e) {
    if (e.response?.status === 404) return { success: true, data: null };
    return {
      success: false,
      error: e.response?.data?.message || "Error fetching bracket",
    };
  }
}

export async function generateBracketAction(tournamentId, data) {
  const locale = await getLocale();
  try {
    const res = await apiClient.post(
      `/tournaments/${tournamentId}/bracket/generate`,
      data
    );
    revalidatePath(
      `/${locale}/dashboard/tournaments-management/view/${tournamentId}`
    );
    return { success: true, data: res.data?.data };
  } catch (e) {
    console.log("Bracket generation error:", e.response?.data || e.message);
    const msg = e.response?.data?.message || "Error generating bracket";
    const errors = e.response?.data?.errors;
    const detail = errors?.length
      ? `${msg}: ${errors.map((err) => `${err.field} - ${err.message}`).join(", ")}`
      : msg;
    return {
      success: false,
      error: detail,
    };
  }
}

export async function deleteBracketAction(tournamentId) {
  const locale = await getLocale();
  try {
    await apiClient.delete(`/tournaments/${tournamentId}/bracket`);
    revalidatePath(
      `/${locale}/dashboard/tournaments-management/view/${tournamentId}`
    );
    return { success: true };
  } catch (e) {
    console.log("Bracket deletion error:", e.response?.data || e.message);
    return {
      success: false,
      error: e.response?.data?.message || "Error deleting bracket",
    };
  }
}

export async function advanceSwissRoundAction(tournamentId) {
  const locale = await getLocale();
  try {
    const res = await apiClient.post(
      `/tournaments/${tournamentId}/bracket/advance-round`
    );
    revalidatePath(
      `/${locale}/dashboard/tournaments-management/view/${tournamentId}`
    );
    return { success: true, data: res.data?.data };
  } catch (e) {
    console.log("Swiss round advance error:", e.response?.data || e.message);
    return {
      success: false,
      error: e.response?.data?.message || "Error advancing swiss round",
    };
  }
}

export async function advanceBRRoundAction(tournamentId) {
  const locale = await getLocale();
  try {
    const res = await apiClient.post(
      `/tournaments/${tournamentId}/bracket/advance-br-round`
    );
    revalidatePath(
      `/${locale}/dashboard/tournaments-management/view/${tournamentId}`
    );
    return { success: true, data: res.data?.data };
  } catch (e) {
    console.log("BR round advance error:", e.response?.data || e.message);
    return {
      success: false,
      error: e.response?.data?.message || "Error advancing BR round",
    };
  }
}

export async function calculateStageAdvancementAction(tournamentId) {
  try {
    const res = await apiClient.get(
      `/tournaments/${tournamentId}/bracket/stage-advancement`
    );
    return { success: true, data: res.data?.data };
  } catch (e) {
    console.log("Stage advancement error:", e.response?.data || e.message);
    return {
      success: false,
      error: e.response?.data?.message || "Error calculating stage advancement",
    };
  }
}

export async function confirmStageAdvancementAction(tournamentId, data) {
  const locale = await getLocale();
  try {
    const res = await apiClient.post(
      `/tournaments/${tournamentId}/bracket/stage-advancement/confirm`,
      data
    );
    revalidatePath(
      `/${locale}/dashboard/tournaments-management/view/${tournamentId}`
    );
    return { success: true, data: res.data?.data };
  } catch (e) {
    console.log("Stage advancement confirm error:", e.response?.data || e.message);
    const msg = e.response?.data?.message || "Error confirming stage advancement";
    const errors = e.response?.data?.errors;
    const detail = errors?.length
      ? `${msg}: ${errors.map((err) => `${err.field} - ${err.message}`).join(", ")}`
      : msg;
    return { success: false, error: detail };
  }
}

export async function updateStageVisibilityAction(tournamentId, stageOrder, isVisibleInApp) {
  const locale = await getLocale();
  try {
    await apiClient.patch(
      `/tournaments/${tournamentId}/bracket/stages/${stageOrder}/visibility`,
      { isVisibleInApp }
    );
    revalidatePath(
      `/${locale}/dashboard/tournaments-management/view/${tournamentId}`
    );
    return { success: true };
  } catch (e) {
    console.log("Stage visibility error:", e.response?.data || e.message);
    return {
      success: false,
      error: e.response?.data?.message || "Error updating stage visibility",
    };
  }
}

// notifications
export async function sendNotificationAction(data) {
  try {
    const res = await apiClient.post("/admin/notifications/send", data);
    return res.data;
  } catch (e) {
    console.log(e.response?.data || e);
    throw new Error(e.response?.data?.message || "Failed to send notification");
  }
}

// Notification Templates
export async function createTemplateAction(data) {
  try {
    const res = await apiClient.post("/admin/notifications/templates", data);
    return res.data;
  } catch (e) {
    throw new Error(e.response?.data?.message || "Failed to create template");
  }
}

export async function updateTemplateAction(id, data) {
  try {
    const res = await apiClient.put(`/admin/notifications/templates/${id}`, data);
    return res.data;
  } catch (e) {
    throw new Error(e.response?.data?.message || "Failed to update template");
  }
}

export async function deleteTemplateAction(id) {
  try {
    const res = await apiClient.delete(`/admin/notifications/templates/${id}`);
    return res.data;
  } catch (e) {
    throw new Error(e.response?.data?.message || "Failed to delete template");
  }
}

export async function fetchNotificationTimelineAction(period = "30d", groupBy = "day") {
  try {
    const res = await apiClient.get(`/admin/notifications/stats/timeline?period=${period}&groupBy=${groupBy}`);
    return res.data.data;
  } catch (e) {
    return { timeline: [] };
  }
}

// Content Creator Requests
export async function approveContentRequest(userId) {
  const locale = await getLocale();
  try {
    const res = await apiClient.post(
      `/admin/content-requests/${userId}/approve`
    );
    revalidatePath(`/${locale}/dashboard/users/content-requests`);
    revalidatePath(`/${locale}/dashboard/users`);
    return res.data;
  } catch (e) {
    console.log(e.response?.data || e);
    throw new Error(e.response?.data?.message || "Failed to approve request");
  }
}

export async function rejectContentRequest(userId, reason) {
  const locale = await getLocale();
  try {
    const res = await apiClient.post(
      `/admin/content-requests/${userId}/reject`,
      { reason }
    );
    revalidatePath(`/${locale}/dashboard/users/content-requests`);
    revalidatePath(`/${locale}/dashboard/users`);
    return res.data;
  } catch (e) {
    console.log(e.response?.data || e);
    throw new Error(e.response?.data?.message || "Failed to reject request");
  }
}

// User Permissions
export async function setUserPermissions(userId, permissions) {
  const locale = await getLocale();
  try {
    const res = await apiClient.put(`/admin/users/${userId}/permissions`, {
      permissions,
    });
    revalidatePath(`/${locale}/dashboard/users/${userId}/edit`);
    return res.data;
  } catch (e) {
    console.log(e.response?.data || e);
    throw new Error(e.response?.data?.message || "Failed to set permissions");
  }
}

export async function addUserPermission(userId, permission) {
  const locale = await getLocale();
  try {
    const res = await apiClient.patch(
      `/admin/users/${userId}/permissions`,
      permission
    );
    revalidatePath(`/${locale}/dashboard/users/${userId}/edit`);
    return res.data;
  } catch (e) {
    console.log(e.response?.data || e);
    throw new Error(e.response?.data?.message || "Failed to add permission");
  }
}

export async function removeUserPermission(userId, entity) {
  const locale = await getLocale();
  try {
    const res = await apiClient.delete(
      `/admin/users/${userId}/permissions/${entity}`
    );
    revalidatePath(`/${locale}/dashboard/users/${userId}/edit`);
    return res.data;
  } catch (e) {
    console.log(e.response?.data || e);
    throw new Error(e.response?.data?.message || "Failed to remove permission");
  }
}

// Content Request Functions
export async function requestContentRole() {
  const locale = await getLocale();
  try {
    const res = await apiClient.post("/users/request-content-role");
    revalidatePath(`/${locale}/dashboard`);
    return res.data;
  } catch (e) {
    console.log(e.response?.data || e);
    throw new Error(
      e.response?.data?.message || "Failed to submit content request"
    );
  }
}

export async function getContentStatus() {
  try {
    const res = await apiClient.get("/users/content-status");
    return res.data.data;
  } catch (e) {
    console.log(e.response?.data || e);
    throw new Error(
      e.response?.data?.message || "Failed to get content status"
    );
  }
}

export async function editLinks(typeEdit, id, data) {
  const locale = await getLocale();
  console.log(typeEdit, id, data);

  try {
    let socialLinks;
    if (typeEdit === "players") {
      socialLinks = await getPlayersLinks(id);
    } else if (typeEdit === "teams") {
      socialLinks = await getTeamsLinks(id);
    } else if (typeEdit === "tournaments") {
      socialLinks = await getTournamentLinks(id);
    }

    console.log(socialLinks);
    const isLinkExist = socialLinks.find((link) => link.id === data.id);
    console.log(isLinkExist);
    if (isLinkExist) {
      socialLinks = socialLinks.filter((link) => link.id !== data.id);
    }
    const res = await apiClient.put(`/${typeEdit}/${id}`, {
      socialLinks: [...socialLinks, data],
    });

    let revalidatePathStr;
    if (typeEdit === "players") {
      revalidatePathStr = `${locale}/dashboard/player-management/links/${id}`;
    } else if (typeEdit === "teams") {
      revalidatePathStr = `${locale}/dashboard/teams-management/links/${id}`;
    } else if (typeEdit === "tournaments") {
      revalidatePathStr = `${locale}/dashboard/tournaments-management/links/${id}`;
    }
    revalidatePath(revalidatePathStr);
    return res.data;
  } catch (e) {
    console.log(e.response.data.errors || e.response.data || e.response || e);
    throw new Error("Error in updating link");
  }
}

export async function deleteLink(typeEdit, id, linkId) {
  const locale = await getLocale();

  try {
    let socialLinks;
    if (typeEdit === "players") {
      socialLinks = await getPlayersLinks(id);
    } else if (typeEdit === "teams") {
      socialLinks = await getTeamsLinks(id);
    } else if (typeEdit === "tournaments") {
      socialLinks = await getTournamentLinks(id);
    }

    console.log(socialLinks);

    const isLinkExist = socialLinks.find((link) => link.id === linkId);

    if (isLinkExist) {
      socialLinks = socialLinks.filter((link) => link.id !== linkId);
    }
    const res = await apiClient.put(`/${typeEdit}/${id}`, {
      socialLinks: socialLinks,
    });

    let revalidatePathStr;
    if (typeEdit === "players") {
      revalidatePathStr = `${locale}/dashboard/player-management/links/${id}`;
    } else if (typeEdit === "teams") {
      revalidatePathStr = `${locale}/dashboard/teams-management/links/${id}`;
    } else if (typeEdit === "tournaments") {
      revalidatePathStr = `${locale}/dashboard/tournaments-management/links/${id}`;
    }
    revalidatePath(revalidatePathStr);
    return res.data;
  } catch (e) {
    console.log(
      e?.response?.data?.errors || e?.response?.data || e?.response || e
    );
    throw new Error("Error in deleting link");
  }
}

// ==================== STANDINGS ====================

export async function initializeStandings(tournamentId, group) {
  "use server";
  const locale = await getLocale();
  try {
    const data = { tournament: tournamentId };
    if (group) data.group = group;
    const res = await apiClient.post("/standings/initialize", data);
    revalidatePath(
      `/${locale}/dashboard/tournaments-management/standings/${tournamentId}`
    );
    return { success: true, data: res.data?.data };
  } catch (e) {
    console.log("Initialize standings error:", e.response?.data || e.message);
    return {
      success: false,
      error: e.response?.data?.message || "Failed to initialize standings",
    };
  }
}

export async function updateStanding(standingId, data) {
  "use server";
  try {
    const res = await apiClient.put(`/standings/${standingId}`, data);
    return { success: true, data: res.data?.data };
  } catch (e) {
    console.log("Update standing error:", e.response?.data || e.message);
    return {
      success: false,
      error: e.response?.data?.message || "Failed to update standing",
    };
  }
}

export async function bulkUpdateStandings(standings) {
  "use server";
  try {
    const res = await apiClient.put("/standings/bulk", { standings });
    return { success: true, data: res.data?.data };
  } catch (e) {
    console.log("Bulk update standings error:", e.response?.data || e.message);
    return {
      success: false,
      error: e.response?.data?.message || "Failed to bulk update standings",
    };
  }
}

export async function recalculateStandings(tournamentId, group) {
  "use server";
  const locale = await getLocale();
  try {
    const url = group
      ? `/standings/tournament/${tournamentId}/recalculate?group=${encodeURIComponent(group)}`
      : `/standings/tournament/${tournamentId}/recalculate`;
    await apiClient.post(url);
    revalidatePath(
      `/${locale}/dashboard/tournaments-management/standings/${tournamentId}`
    );
    return { success: true };
  } catch (e) {
    console.log("Recalculate standings error:", e.response?.data || e.message);
    return {
      success: false,
      error: e.response?.data?.message || "Failed to recalculate standings",
    };
  }
}

export async function recalculateStandingsFromMatches(tournamentId) {
  "use server";
  const locale = await getLocale();
  try {
    const res = await apiClient.post(
      `/standings/tournament/${tournamentId}/recalculate-from-matches`
    );
    revalidatePath(
      `/${locale}/dashboard/tournaments-management/standings/${tournamentId}`
    );
    return { success: true, data: res.data?.data };
  } catch (e) {
    console.log(
      "Recalculate from matches error:",
      e.response?.data || e.message
    );
    return {
      success: false,
      error:
        e.response?.data?.message || "Failed to recalculate from matches",
    };
  }
}

export async function recalculatePlacementStandings(tournamentId) {
  "use server";
  const locale = await getLocale();
  try {
    const res = await apiClient.post(
      `/standings/tournament/${tournamentId}/recalculate-placement`
    );
    revalidatePath(
      `/${locale}/dashboard/tournaments-management/standings/${tournamentId}`
    );
    return { success: true, data: res.data?.data };
  } catch (e) {
    console.log(
      "Recalculate placement error:",
      e.response?.data || e.message
    );
    return {
      success: false,
      error:
        e.response?.data?.message || "Failed to recalculate placement standings",
    };
  }
}

export async function deleteStanding(standingId) {
  "use server";
  try {
    await apiClient.delete(`/standings/${standingId}`);
    return { success: true };
  } catch (e) {
    console.log("Delete standing error:", e.response?.data || e.message);
    return {
      success: false,
      error: e.response?.data?.message || "Failed to delete standing",
    };
  }
}

export async function deleteAllStandings(tournamentId) {
  "use server";
  const locale = await getLocale();
  try {
    const res = await apiClient.delete(
      `/standings/tournament/${tournamentId}`
    );
    revalidatePath(
      `/${locale}/dashboard/tournaments-management/standings/${tournamentId}`
    );
    return { success: true, data: res.data?.data };
  } catch (e) {
    console.log("Delete all standings error:", e.response?.data || e.message);
    return {
      success: false,
      error: e.response?.data?.message || "Failed to delete all standings",
    };
  }
}

// ==================== CLUBS ====================

export async function addClub(clubData) {
  const locale = await getLocale();
  try {
    const cleanData = cleanNullValues(clubData);
    await apiClient.post("/clubs", cleanData);
  } catch (e) {
    console.log("Club creation error:", e.response?.data || e.message);
    throw new Error(e.response?.data?.message || "Error in adding club");
  }
  redirect(`/${locale}/dashboard/clubs-management`);
}

export async function editClub(clubData) {
  const locale = await getLocale();
  try {
    const cleanData = cleanNullValues(clubData);
    await apiClient.put(`/clubs/${cleanData.id}`, cleanData);
    revalidatePath(`/${locale}/dashboard/clubs-management`);
  } catch (e) {
    console.log("Club update error:", e.response?.data || e.message);
    throw new Error(e.response?.data?.message || "Error in updating club");
  }
  redirect(`/${locale}/dashboard/clubs-management`);
}

export async function deleteClub(id) {
  const locale = await getLocale();
  try {
    await apiClient.delete(`/clubs/${id}`);
    revalidatePath(`/${locale}/dashboard/clubs-management`);
    return { success: true };
  } catch (e) {
    throw new Error("Error in deleting club");
  }
}

export async function addTeamToClub(clubId, teamData) {
  const locale = await getLocale();
  try {
    await apiClient.post(`/clubs/${clubId}/teams`, teamData);
    revalidatePath(`/${locale}/dashboard/clubs-management/view/${clubId}`);
    return { success: true };
  } catch (e) {
    throw new Error(e.response?.data?.message || "Error adding team to club");
  }
}

export async function removeTeamFromClub(clubId, teamId) {
  const locale = await getLocale();
  try {
    await apiClient.delete(`/clubs/${clubId}/teams/${teamId}`);
    revalidatePath(`/${locale}/dashboard/clubs-management/view/${clubId}`);
    return { success: true };
  } catch (e) {
    throw new Error(
      e.response?.data?.message || "Error removing team from club"
    );
  }
}

export async function addPlayerToClub(clubId, playerData) {
  const locale = await getLocale();
  try {
    await apiClient.post(`/clubs/${clubId}/players`, playerData);
    revalidatePath(`/${locale}/dashboard/clubs-management/view/${clubId}`);
    return { success: true };
  } catch (e) {
    throw new Error(
      e.response?.data?.message || "Error adding player to club"
    );
  }
}

export async function removePlayerFromClub(clubId, playerId) {
  const locale = await getLocale();
  try {
    await apiClient.delete(`/clubs/${clubId}/players/${playerId}`);
    revalidatePath(`/${locale}/dashboard/clubs-management/view/${clubId}`);
    return { success: true };
  } catch (e) {
    throw new Error(
      e.response?.data?.message || "Error removing player from club"
    );
  }
}

// ====== EVENTS ======
export async function addEvent(eventData) {
  const locale = await getLocale();
  try {
    const cleanData = cleanNullValues(eventData);
    await apiClient.post("/events", cleanData);
  } catch (e) {
    const msg = e.response?.data?.message || "Error creating event";
    const errors = e.response?.data?.errors;
    const details = errors?.map((err) => `${err.field}: ${err.message}`).join(", ");
    throw new Error(details ? `${msg} — ${details}` : msg);
  }
  redirect(`/${locale}/dashboard/events-management`);
}

export async function editEvent(eventData) {
  const locale = await getLocale();
  try {
    const cleanData = cleanNullValues(eventData);
    await apiClient.put(`/events/${cleanData.id}`, cleanData);
    revalidatePath(`/${locale}/dashboard/events-management`);
  } catch (e) {
    const msg = e.response?.data?.message || "Error updating event";
    const errors = e.response?.data?.errors;
    const details = errors?.map((err) => `${err.field}: ${err.message}`).join(", ");
    throw new Error(details ? `${msg} — ${details}` : msg);
  }
  redirect(`/${locale}/dashboard/events-management`);
}

export async function deleteEvent(id) {
  const locale = await getLocale();
  try {
    await apiClient.delete(`/events/${id}`);
    revalidatePath(`/${locale}/dashboard/events-management`);
    return { success: true };
  } catch (e) {
    throw new Error(e.response?.data?.message || "Error deleting event");
  }
}

export async function addTournamentToEvent(eventId, tournamentId) {
  const locale = await getLocale();
  try {
    await apiClient.post(`/events/${eventId}/tournaments/${tournamentId}`);
    revalidatePath(`/${locale}/dashboard/events-management/view/${eventId}`);
    return { success: true };
  } catch (e) {
    throw new Error(e.response?.data?.message || "Error adding tournament");
  }
}

export async function removeTournamentFromEvent(eventId, tournamentId) {
  const locale = await getLocale();
  try {
    await apiClient.delete(`/events/${eventId}/tournaments/${tournamentId}`);
    revalidatePath(`/${locale}/dashboard/events-management/view/${eventId}`);
    return { success: true };
  } catch (e) {
    throw new Error(e.response?.data?.message || "Error removing tournament");
  }
}

export async function assignClubToTournament(eventId, tournamentId, data) {
  const locale = await getLocale();
  try {
    await apiClient.post(
      `/events/${eventId}/tournaments/${tournamentId}/assign-club`,
      data
    );
    revalidatePath(`/${locale}/dashboard/events-management/view/${eventId}`);
    return { success: true };
  } catch (e) {
    throw new Error(e.response?.data?.message || "Error assigning club");
  }
}

export async function removeClubFromTournament(eventId, tournamentId, clubId) {
  const locale = await getLocale();
  try {
    await apiClient.delete(
      `/events/${eventId}/tournaments/${tournamentId}/assign-club/${clubId}`
    );
    revalidatePath(`/${locale}/dashboard/events-management/view/${eventId}`);
    return { success: true };
  } catch (e) {
    throw new Error(e.response?.data?.message || "Error removing club");
  }
}

export async function recordClubResult(eventId, data) {
  const locale = await getLocale();
  try {
    await apiClient.post(`/events/${eventId}/standings/record`, data);
    revalidatePath(`/${locale}/dashboard/events-management/view/${eventId}`);
    return { success: true };
  } catch (e) {
    throw new Error(e.response?.data?.message || "Error recording result");
  }
}

export async function removeClubResult(eventId, clubId, tournamentId) {
  const locale = await getLocale();
  try {
    await apiClient.delete(
      `/events/${eventId}/standings/${clubId}/results/${tournamentId}`
    );
    revalidatePath(`/${locale}/dashboard/events-management/view/${eventId}`);
    return { success: true };
  } catch (e) {
    throw new Error(e.response?.data?.message || "Error removing result");
  }
}
