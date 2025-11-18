"use server";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import apiClient from "./apiCLient";

import { deleteSession, saveSession } from "./session";
import { redirect } from "next/navigation";

// login
export async function login(userData) {
  try {
    const res = await apiClient.post("/authenticate", userData);

    await saveSession(res?.data?.id_token);
  } catch (e) {
    console.log(e);
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
    // console.log(e.response);
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
    const res = await apiClient.post("/news", {
      ...newsData,
      publishDate:
        newsData.status === "PUBLISHED"
          ? new Date().toISOString()
          : newsData.publishDate,
    });
    // console.log(res.data);
    return res.data;
  } catch (e) {
    // console.log(e.response);
    throw new Error("Error in adding news");
  }
}

export async function editNews(newsData) {
  try {
    const res = await apiClient.put(`/news/${newsData.id}`, newsData);
    revalidatePath(`/${locale}/dashboard/news/edit/${newsData.id}`);
    return res.data;
  } catch (e) {
    // console.log(e.response);
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
  redirect("/dashboard/tournaments/edit");
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
