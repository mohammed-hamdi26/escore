"use server";
import { revalidatePath } from "next/cache";
import apiClient from "./apiCLient";

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
  try {
    const res = await apiClient.put(`/players/${playerData.id}`, playerData);
    revalidatePath(`/dashboard/player-management/edit/${playerData.id}`);
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
    revalidatePath(`/dashboard/games-management/edit/${gameData.id}`);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in updating game");
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
    revalidatePath(`/dashboard/teams-management/edit/${teamData.id}`);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in updating team");
  }
}
