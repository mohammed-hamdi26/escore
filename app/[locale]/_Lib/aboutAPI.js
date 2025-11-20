import apiClient from "./apiCLient";

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
