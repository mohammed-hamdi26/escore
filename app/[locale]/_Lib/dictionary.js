import axios from "axios";
import apiClient from "./apiCLient";

export async function getDictionaryWords(code) {
  try {
    const res = await apiClient.get(`/v1/languages/${code}/dictionary`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch dictionary:", error);
    throw error;
  }
}

export async function getSpecificWordTranslation(code, word) {
  try {
    const response = await apiClient.get(
      `/v1/languages/${code}/dictionary/${word}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get word translation:", error);
    throw error;
  }
}
