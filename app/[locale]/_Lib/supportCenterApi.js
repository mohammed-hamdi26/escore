import apiClient from "./apiCLient";

export async function getTickets() {
  try {
    const res = await apiClient.get("/support-tickets");
    return res.data;
  } catch (e) {
    throw new Error("Failed to get tickets");
  }
}
