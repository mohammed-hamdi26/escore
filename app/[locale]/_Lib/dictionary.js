import axios from "axios";
import apiClient from "./apiCLient";

export async function getDictionaryWords(code) {
  try {
    const res = await apiClient.get(`/settings/languages/${code}`);
    return res.data.data;
  } catch (error) {
    console.log(error.response.data.errors || error.response.data || error);
    console.error("Failed to fetch dictionary:", error);
    throw error;
  }
}

export async function getSpecificWordTranslation(code, word) {
  try {
    const response = await apiClient.get(
      `/settings/languages/${code}/dictionary/${word}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get word translation:", error);
    throw error;
  }
}
