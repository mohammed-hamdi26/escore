import axios from "axios";

export async function getPrivacyContent(language_code) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/privacy/${language_code}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log("Failed to get language privacy and policy", error);
    throw error;
  }
}
export async function addPrivacyContent(language_code, content) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/privacy`,
      { languageCode: language_code, content: content },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to add language privacy and policy", error);
    throw error;
  }
}

export async function deletePrivacyContent(language_code) {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/privacy/${language_code}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to get language privacy and policy", error);
    throw error;
  }
}

export async function updatePrivacyContent(language_code, content) {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/privacy/${language_code}`,
      { languageCode: language_code, content: content },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to get language privacy and policy", error);
    throw error;
  }
}
