"use server";
import apiClient from "./apiCLient";
export async function login(userData) {
  try {
    const res = await apiClient.post("/authenticate", userData);
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Invalid credentials");
  }
}
