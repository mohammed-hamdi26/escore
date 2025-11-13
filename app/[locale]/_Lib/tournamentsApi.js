import apiClient from "./apiCLient";

export async function getTournaments() {
  try {
    const res = await apiClient.get("/tournaments");

    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Error in Get tournaments");
  }
}
