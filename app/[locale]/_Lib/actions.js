"use server";
import { revalidatePath } from "next/cache";
import apiClient from "./apiCLient";
import axios from "axios";
import { getLocale } from "next-intl/server";

// login
export async function login(userData) {
  try {
    const res = await apiClient.post("/authenticate", userData);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in login");
  }
}

// player actions
export async function addPlayer(playerData) {
  console.log(playerData);
  try {
    const res = await apiClient.post("/players", playerData);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in adding player");
  }
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
// games actions
export async function addGame(gameData) {
  try {
    const res = await apiClient.post("/games", gameData);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in adding game");
  }
}

export async function updateGame(gameData) {
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
  console.log(id);
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
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in adding team");
  }
}

export async function updateTeam(teamData) {
  try {
    const res = await apiClient.put(`/teams/${teamData.id}`, teamData);
    revalidatePath(`/${locale}/dashboard/teams-management/edit/${teamData.id}`);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in updating team");
  }
}

// News Actions
export async function addNews(newsData) {
  try {
    const res = await apiClient.post("/news", newsData);
    console.log(res.data);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in adding news");
  }
}

export async function editNews(newsData) {
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
  console.log(id);
  try {
    const res = await apiClient.delete(`/news/${id}`);
    revalidatePath(`/${locale}/dashboard/news/edit`);
    return res.data;
  } catch (e) {
    console.log(e.response);
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
    console.log(e.response);
    throw new Error("error in upload");
  }
}

// tournaments

export async function addTournament(tournamentData) {
  try {
    const res = await apiClient.post("/tournaments", tournamentData);
    console.log(res.data);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in adding tournament");
  }
}

export async function editTournament(tournamentData) {
  try {
    const res = await apiClient.put(
      `/tournaments/${tournamentData.id}`,
      tournamentData
    );
    revalidatePath(`/${locale}/dashboard/news/edit/${tournamentData.id}`);
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
    revalidatePath(`/${locale}/dashboard/news/edit`);
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
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in adding game");
  }
}

export async function updateMatch(matchData) {
  const locale = await getLocale();
  try {
    const res = await apiClient.put(`/games/${matchData.id}`, matchData);
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
    const res = await apiClient.delete(`/games/${id}`);
    revalidatePath(`/${locale}/dashboard/games-management/edit`);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("error in Delete");
  }
}
