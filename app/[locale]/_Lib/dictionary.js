import axios from "axios";

const BASE_URL = "https://testsapis.pythonanywhere.com/api/v1";

// Normalize dictionary fetch so callers always receive a plain word->translation object.
export async function getDictionaryWords(code) {
  try {
    const res = await axios.get(`${BASE_URL}/languages/${code}/dictionary`);
    // Attempt common shapes; fall back to raw.
    const data = res.data;
    return data.dictionary || data.data || data; // expecting an object map
  } catch (error) {
    console.error("Failed to fetch dictionary:", error);
    throw error;
  }
}

export async function addToDictionary(code, { word, translation }) {
  try {
    // Remove trailing space in URL and send normalized payload
    const response = await axios.post(
      `${BASE_URL}/languages/${code}/dictionary`,
      { word, translation }
    );
    console.log("Word added:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to add word:", error);
    throw error;
  }
}

export async function updateWord(code, word, translation) {
  try {
    // Send as object; API likely expects { translation: "new" }
    const response = await axios.put(
      `${BASE_URL}/languages/${code}/dictionary/${word}`,
      { translation }
    );
    console.log("Word translation updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update word translation", error);
    throw error;
  }
}

export async function getSpecificWordTranslation(code, word) {
  try {
    const response = await axios.get(
      `${BASE_URL}/languages/${code}/dictionary/${word}`
    );
    return response.data.translation || response.data.data || response.data; // flexible
  } catch (error) {
    console.error("Failed to get word translation:", error);
    throw error;
  }
}

export async function deleteWord(code, word) {
  try {
    const response = await axios.delete(
      `${BASE_URL}/languages/${code}/dictionary/${word}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete word:", error);
    throw error;
  }
}
