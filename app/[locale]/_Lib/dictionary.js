import axios from "axios";

export async function getDictionaryWords(code) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/languages/${code}/dictionary`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to fetch dictionary:", error);
    throw error;
  }
}

export async function addToDictionary(code, { word, translation }) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/languages/${code}/dictionary`,
      { word, translation },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      }
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
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/languages/${code}/dictionary/${word}`,
      { translation },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      }
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/languages/${code}/dictionary/${word}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get word translation:", error);
    throw error;
  }
}

export async function deleteWord(code, word) {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/languages/${code}/dictionary/${word}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete word:", error);
    throw error;
  }
}
