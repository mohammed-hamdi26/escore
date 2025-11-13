import axios from "axios";

const BASE_URL = "https://testsapis.pythonanywhere.com/api/v1";

export async function getLanguages() {
  const res = await axios.get(`${BASE_URL}/languages`);
  return res.data;
}

export async function addLanguage(language_data) {
  try {
    const response = await axios.post(`${BASE_URL}/languages`, language_data);
    console.log('Language added:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to add language:', error);
    throw error;
  }
}
