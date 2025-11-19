import axios from "axios";

export async function getAboutContent(language_code) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/about-app/${language_code}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}
export async function addAboutContent(language_code, content) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/about-app`,
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
    throw error;
  }
}

export async function deleteAboutContent(language_code) {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/about-app/${language_code}`,
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
    throw error;
  }
}

export async function updateAboutContent(language_code, content) {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/about-app/${language_code}`,
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
    throw error;
  }
}
