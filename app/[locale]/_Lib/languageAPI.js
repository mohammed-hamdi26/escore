import axios from "axios";

export async function getLanguages() {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/languages`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function addLanguage(language_data) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/languages`,
      language_data,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      }
    );
    console.log("Language added:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to add language:", error);
    throw error;
  }
}

export async function updateLanguage(code, language_data) {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/languages/${code}`,
      language_data,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      }
    );
    console.log("Language updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update language:", error);
    throw error;
  }
}

export async function getSpecificLanguage(code) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/languages/${code}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Failed to get language:", error);
    throw error;
  }
}

export async function deleteLanguage(code) {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/languages/${code}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to delete language:", error);
    throw error;
  }
}
