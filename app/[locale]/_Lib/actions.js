"use server";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import apiClient from "./apiCLient";

import { deleteSession, saveSession } from "./session";
import { redirect } from "next/navigation";
import { getPlayersLinks } from "./palyerApi";
import { getAwardsTeam, getTeamsLinks } from "./teamsApi";

// login
export async function login(userData) {
  try {
    const res = await apiClient.post("/auth/login", userData);

    await saveSession(res?.data?.data?.tokens?.accessToken);
  } catch (e) {
    throw new Error("Error in login");
  }
  redirect("/dashboard");
}
export async function register(userData) {
  try {
    await apiClient.post("/register", userData);
  } catch (e) {
    console.log(e.response);
    throw new Error("Maybe Email already exists");
  }

  redirect("/register/code-verification");
}
export async function verifyAccount(code) {
  console.log("code", code);
  try {
    await apiClient.get(`/activate?key=${code}`);
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in verify account");
  }
  redirect("/login");
}
export async function logout() {
  await deleteSession();
  redirect("/login");
}

// player actions
export async function addPlayer(playerData) {
  try {
    const res = await apiClient.post("/players", playerData);
    // return res.data;
  } catch (e) {
    console.log(e.response.data.errors || e.response.data || e.response || e);
    throw new Error("Error in adding player");
  }
  redirect("/dashboard/player-management/edit");
}
export async function editPlayer(playerData) {
  const locale = await getLocale();
  try {
    const res = await apiClient.put(`/players/${playerData.id}`, playerData);
    revalidatePath(
      `${locale}/dashboard/player-management/edit/${playerData.id}`
    );
    return res.data;
  } catch (e) {
    console.log(e.response.data.errors || e.response.data || e.response || e);
    throw new Error("Error in updating player");
  }
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
    revalidatePath(`${locale}/dashboard/player-management/edit`);
    return res.data;
  } catch (e) {
    throw new Error("error in Delete");
  }
}
// games actions
export async function addGame(gameData) {
  try {
    const res = await apiClient.post("/games", gameData);
    // return res.data;
  } catch (e) {
    console.log(e.response.data.errors || e.response.data || e.response || e);
    throw new Error("Error in adding game");
  }
  redirect("/dashboard/games-management/edit");
}

export async function updateGame(gameData) {
  const locale = await getLocale();
  try {
    const res = await apiClient.put(`/games/${gameData.id}`, gameData);
    revalidatePath(`/${locale}/dashboard/games-management/edit/${gameData.id}`);
    return res.data;
  } catch (e) {
    throw new Error("Error in updating game");
  }
}
export async function deleteGame(id) {
  const locale = await getLocale();

  try {
    const res = await apiClient.delete(`/games/${id}`);
    revalidatePath(`/${locale}/dashboard/games-management/edit`);
    return res.data;
  } catch (e) {
    throw new Error("error in Delete");
  }
}

// Teams Actions
export async function addTeam(teamData) {
  try {
    const res = await apiClient.post("/teams", teamData);
    // return res.data;
  } catch (e) {
    console.log(e.response.data.errors || e.response.data || e.response || e);
    throw new Error("Error in adding team");
  }
  redirect("/dashboard/teams-management/edit");
}

export async function updateTeam(teamData) {
  const locale = await getLocale();

  try {
    const res = await apiClient.put(`/teams/${teamData.id}`, teamData);
    revalidatePath(`/${locale}/dashboard/teams-management/edit/${teamData.id}`);

    return res.data;
  } catch (e) {
    throw new Error("Error in updating team");
  }
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

// News Actions
export async function addNews(newsData) {
  const locale = await getLocale();
  try {
    const newsDataWithDate = {
      ...newsData,
      publishDate:
        newsData.status === "PUBLISHED"
          ? new Date().toISOString()
          : newsData.publishDate,
    };
    const res = await apiClient.post("/news", newsDataWithDate);

    // return res.data;
  } catch (e) {
    console.log(e.response.data.errors || e.response.data || e.response || e);
    throw new Error("Error in adding news");
  }
  redirect(`/${locale}/dashboard/news/edit`);
}

export async function editNews(newsData) {
  const locale = await getLocale();
  try {
    const res = await apiClient.put(`/news/${newsData.id}`, newsData);
    revalidatePath(`/${locale}/dashboard/news/edit/${newsData.id}`);
    return res.data;
  } catch (e) {
    console.log(e.response.data.errors || e.response.data || e.response || e);
    throw new Error("Error in updating news");
  }
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

export async function uploadPhoto(formData) {
  try {
    const res = await apiClient.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data.url;
  } catch (e) {
    console.log(e.response);
    throw new Error("error in upload");
  }
}

// tournaments

export async function addTournament(tournamentData) {
  try {
    const res = await apiClient.post("/tournaments", tournamentData);

    // return res.data;
  } catch (e) {
    console.log(e.response);
    console.log(e.response.data.errors);
    throw new Error("Error in adding tournament");
  }
  redirect("/dashboard/tournaments-management/edit");
}

export async function editTournament(tournamentData) {
  const locale = await getLocale();
  try {
    const res = await apiClient.put(
      `/tournaments/${tournamentData.id}`,
      tournamentData
    );
    revalidatePath(
      `/${locale}/dashboard/tournaments/edit/${tournamentData.id}`
    );
    return res.data;
  } catch (e) {
    console.log(e.response.data.errors || e.response.data || e.response || e);
    throw new Error("Error in updating tournaments");
  }
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

// matches

export async function addMatch(matchData) {
  try {
    const res = await apiClient.post("/matches", matchData);
    return res.data;
  } catch (e) {
    console.log(e.response.data.errors || e.response.data || e.response || e);
    throw new Error("Error in adding match");
  }
}

export async function updateMatch(matchData) {
  const locale = await getLocale();
  try {
    console.log("Sending match data:", JSON.stringify(matchData, null, 2));
    const res = await apiClient.put(`/matches/${matchData.id}`, matchData);
    revalidatePath(
      `/${locale}/dashboard/matches-management/edit/${matchData.id}`
    );
    return res.data;
  } catch (e) {
    console.log(
      "Full error response:",
      JSON.stringify(e.response?.data, null, 2)
    );
    console.log("Validation errors:", e.response?.data?.errors);
    throw new Error("Error in updating match");
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
    throw new Error(e.response?.data?.message || "Error toggling featured status");
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
      // {
      //   headers: {
      //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
      //   },
      // }
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
      // {
      //   headers: {
      //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
      //   },
      // }
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
    const response = await apiClient.delete(
      `/settings/languages/${code}`
      // {
      //   headers: {
      //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
      //   },
      // }
    );

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

export async function replayTicket(id, data) {
  const locale = await getLocale();
  try {
    const res = apiClient.patch(`/support/tickets/${id}/replay`, data);
    revalidatePath(`/${locale}/dashboard/support-center`);
    // return res.data;
  } catch (error) {
    console.log("Failed to get replay ticket", error);
    throw error;
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

// transfars

export async function addTransfer(data) {
  const locale = await getLocale();
  try {
    const res = await apiClient.post(`/transfers`, data);
    // return res.data;
  } catch (error) {
    console.log(
      error.response.data.errors ||
        error.response.data ||
        error.response ||
        error
    );
    // console.log("Failed to add transfer", error);
    throw error;
  }
  redirect(`/${locale}/dashboard/transfers-management/edit`);
}

export async function editTransfer(data) {
  const locale = await getLocale();
  try {
    const res = await apiClient.put(`/transfers/${data.id}`, data);
    revalidatePath(`/${locale}/dashboard/transfer-management/edit/${data.id}`);
    // return res.data;
  } catch (error) {
    console.log(
      error.response.data.errors ||
        error.response.data ||
        error.response ||
        error
    );
    // console.log("Failed to add transfer", error);
    throw error;
  }
  // redirect(`/${locale}/dashboard/transfer-management/edit/${data.id}`);
}

export async function deleteTransfer(id) {
  const locale = await getLocale();
  try {
    const res = await apiClient.delete(`/transfers/${id}`);
    revalidatePath(`/${locale}/dashboard/transfer-management`);
    // return res.data;
  } catch (error) {
    console.log("Failed to delete transfer", error);
    throw error;
  }
  // redirect(`/${locale}/dashboard/transfer-management`);
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
    if (data.isVerified !== undefined) userUpdateData.isVerified = data.isVerified;

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
    return res.data.data;
  } catch (error) {
    console.log("Failed to reset password", error);
    throw new Error(error.response?.data?.message || "Failed to reset password");
  }
}

export async function forgotPassword(email) {
  try {
    const res = await apiClient.post("/auth/forgot-password", { email });
    return res.data;
  } catch (error) {
    console.log("Failed to send reset email", error);
    throw new Error(error.response?.data?.message || "Failed to send reset email");
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

// Content Creator Requests
export async function approveContentRequest(userId) {
  const locale = await getLocale();
  try {
    const res = await apiClient.post(`/admin/content-requests/${userId}/approve`);
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
    const res = await apiClient.post(`/admin/content-requests/${userId}/reject`, { reason });
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
    const res = await apiClient.put(`/admin/users/${userId}/permissions`, { permissions });
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
    const res = await apiClient.patch(`/admin/users/${userId}/permissions`, permission);
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
    const res = await apiClient.delete(`/admin/users/${userId}/permissions/${entity}`);
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
    throw new Error(e.response?.data?.message || "Failed to submit content request");
  }
}

export async function getContentStatus() {
  try {
    const res = await apiClient.get("/users/content-status");
    return res.data.data;
  } catch (e) {
    console.log(e.response?.data || e);
    throw new Error(e.response?.data?.message || "Failed to get content status");
  }
}

export async function editLinks(typeEdit, id, data) {
  const locale = await getLocale();
  console.log(typeEdit, id, data);

  try {
    let socialLinks =
      typeEdit === "players"
        ? await getPlayersLinks(id)
        : await getTeamsLinks(id);

    console.log(socialLinks);
    const isLinkExist = socialLinks.find((link) => link.id === data.id);
    console.log(isLinkExist);
    if (isLinkExist) {
      socialLinks = socialLinks.filter((link) => link.id !== data.id);
    }
    const res = await apiClient.put(`/${typeEdit}/${id}`, {
      socialLinks: [...socialLinks, data],
    });
    revalidatePath(
      `${locale}/dashboard/${
        typeEdit === "players" ? "player-management" : "teams-management"
      }/links/${id}`
    );
    return res.data;
  } catch (e) {
    console.log(e.response.data.errors || e.response.data || e.response || e);
    throw new Error("Error in updating player");
  }
}

export async function deleteLink(typeEdit, id, linkId) {
  const locale = await getLocale();

  try {
    let socialLinks =
      typeEdit === "players"
        ? await getPlayersLinks(id)
        : await getTeamsLinks(id);

    console.log(socialLinks);

    const isLinkExist = socialLinks.find((link) => link.id === linkId);

    if (isLinkExist) {
      socialLinks = socialLinks.filter((link) => link.id !== linkId);
    }
    const res = await apiClient.put(`/${typeEdit}/${id}`, {
      socialLinks: socialLinks,
    });
    revalidatePath(
      `${locale}/dashboard/${
        typeEdit === "players" ? "player-management" : "teams-management"
      }/links/${id}`
    );
    return res.data;
  } catch (e) {
    console.log(
      e?.response?.data?.errors || e?.response?.data || e?.response || e
    );
    throw new Error("Error in updating player");
  }
}
