function getTeams() {
  try {
    const res = apiClient.get("/teams");
    return res.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get teams");
  }
}
