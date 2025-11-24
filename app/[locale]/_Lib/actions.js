"use server";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import apiClient from "./apiCLient";

import { deleteSession, saveSession } from "./session";
import { redirect } from "next/navigation";

// login
export async function login(userData) {
  try {
    const res = await apiClient.post("/authenticate", userData, {
      headers: {
        "apple-id": "",
      },
    });

    await saveSession(res?.data?.id_token);
  } catch (e) {
    console.log(e.response);
    // if (JSON.stringify(e).contains("NEXT_REDIRECT")) {
    //   redirect("/dashboard");
    //   return;
    // }

    throw new Error("Error in login");
  }
  redirect("/dashboard");
}
export async function logout() {
  await deleteSession();
  redirect("/login");
}

// player actions
export async function addPlayer(playerData) {
  // console.log(playerData);
  try {
    const res = await apiClient.post("/players", playerData);
    // return res.data;
  } catch (e) {
    console.log(e.response);
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
    console.log(e.response);
    throw new Error("Error in updating player");
  }
}
export async function deletePlayer(id) {
  const locale = await getLocale();
  console.log(id);
  try {
    const res = await apiClient.delete(`/players/${id}`);
    revalidatePath(`${locale}/dashboard/player-management/edit`);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("error in Delete");
  }
}
// games actions
export async function addGame(gameData) {
  try {
    const res = await apiClient.post("/games", gameData);
    // return res.data;
  } catch (e) {
    // console.log(e.response);
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
    console.log(e.response);
    throw new Error("Error in updating game");
  }
}
export async function deleteGame(id) {
  const locale = await getLocale();
  // console.log(id);
  try {
    const res = await apiClient.delete(`/games/${id}`);
    revalidatePath(`/${locale}/dashboard/games-management/edit`);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("error in Delete");
  }
}

// Teams Actions
export async function addTeam(teamData) {
  try {
    const res = await apiClient.post("/teams", teamData);
    // return res.data;
  } catch (e) {
    // console.log(e.response);
    throw new Error("Error in adding team");
  }
  redirect("/dashboard/teams-management/edit");
}

export async function updateTeam(teamData) {
  const locale = await getLocale();
  console.log(teamData);
  try {
    const res = await apiClient.put(`/teams/${teamData.id}`, teamData);
    revalidatePath(`/${locale}/dashboard/teams-management/edit/${teamData.id}`);
    console.log(res.data);
    return res.data;
  } catch (e) {
    // console.log(e.response);
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
    console.log(e.response);
    throw new Error("error in Delete");
  }
}

// News Actions
export async function addNews(newsData) {
  try {
    const newsDataWithDate = {
      ...newsData,
      publishDate:
        newsData.status === "PUBLISHED"
          ? new Date().toISOString()
          : newsData.publishDate,
    };
    const res = await apiClient.post("/news", newsDataWithDate);
    // console.log(res.data);
    // return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in adding news");
  }
  redirect("/dashboard/news/edit");
}

export async function editNews(newsData) {
  const locale = await getLocale();
  try {
    const res = await apiClient.put(`/news/${newsData.id}`, newsData);
    revalidatePath(`/${locale}/dashboard/news/edit/${newsData.id}`);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in updating news");
  }
}
export async function deleteNew(id) {
  const locale = await getLocale();
  // console.log(id);
  try {
    const res = await apiClient.delete(`/news/${id}`);
    revalidatePath(`/${locale}/dashboard/news/edit`);
    return res.data;
  } catch (e) {
    // console.log(e.response);
    throw new Error("error in Delete");
  }
}

export async function uploadPhoto(formData) {
  try {
    const url = await apiClient.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return url.data;
  } catch (e) {
    // console.log(e.response);
    throw new Error("error in upload");
  }
}

// tournaments

export async function addTournament(tournamentData) {
  try {
    const res = await apiClient.post("/tournaments", tournamentData);
    console.log(res.data);
    // return res.data;
  } catch (e) {
    console.log(e.response);
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
    console.log(e.response);
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
    console.log(e.response);
    throw new Error("error in Delete tournament");
  }
}

// matches

export async function addMatch(matchData) {
  try {
    const res = await apiClient.post("/matches", matchData);
    // return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in adding game");
  }
  redirect("/dashboard/matches-management/edit");
}

export async function updateMatch(matchData) {
  const locale = await getLocale();
  try {
    const res = await apiClient.put(`/matches/${matchData.id}`, matchData);
    revalidatePath(
      `/${locale}/dashboard/matches-management/edit/${matchData.id}`
    );
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in updating game");
  }
}
export async function deleteMatch(id) {
  const locale = await getLocale();
  console.log(id);
  try {
    const res = await apiClient.delete(`/matches/${id}`);
    revalidatePath(`/${locale}/dashboard/matches-management/edit`);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("error in Delete");
  }
}

export async function addLink(linkData) {
  try {
    const res = await apiClient.post("/social-links", linkData);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in adding link");
  }
}

export async function addFavoriteCharacter(characterData) {
  try {
    const res = await apiClient.post("/favorite-characters", characterData);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in adding favorite character");
  }
}

export async function addAward(awardData) {
  try {
    const res = await apiClient.post("/achievements", awardData);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in adding favorite game");
  }
}

// langues

export async function addLanguage(language_data) {
  try {
    const response = await apiClient.post(
      `/v1/languages`,
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
      `/v1/languages/${code}`,
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
      `/v1/languages/${code}`
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
    const response = await apiClient.post(`/v1/languages/${code}/dictionary`, {
      word,
      translation,
    });
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
      `/v1/languages/${code}/dictionary/${word}`,
      { translation }
    );
    console.log("Word translation updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update word translation", error);
    throw error;
  }
}
export async function deleteWord(code, word) {
  try {
    const response = await apiClient.delete(
      `/v1/languages/${code}/dictionary/${word}`
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
      `/v1/about-app`,
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
    const res = await apiClient.delete(`/v1/about-app/${language_code}`, {
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
      `/v1/about-app/${language_code}`,
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

export async function getAboutContent(language_code) {
  try {
    const res = await apiClient.get(`/v1/about-app/${language_code}`, {
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
    const res = await apiClient.get(`/v1/privacy/${language_code}`, {
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
      `/v1/privacy`,
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
    const res = await apiClient.delete(`/v1/privacy/${language_code}`, {
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
    const res = await apiClient.patch(
      `/v1/privacy/${language_code}`,
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
    console.log("Failed to get language privacy and policy", error);
    throw error;
  }
}

export async function addTheme(theme) {
  try {
    const res = await apiClient.post(`/v1/themes`, theme);
    console.log("theme added", res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to add theme", error);
    throw error;
  }
}
export async function updateTheme(theme, theme_id) {
  try {
    const res = await apiClient.put(`/v1/themes/${theme_id}`, theme);
    console.log("theme updated", res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to add theme", error);
    throw error;
  }
}
export async function deleteTheme(theme_id) {
  try {
    const res = await apiClient.delete(`/v1/themes/${theme_id}`);
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
    const res = apiClient.patch(`/support-tickets/${id}`, data);
    revalidatePath(`/${locale}/dashboard/support-center`);
    // return res.data;
  } catch (error) {
    console.log("Failed to get replay ticket", error);
    throw error;
  }
}
