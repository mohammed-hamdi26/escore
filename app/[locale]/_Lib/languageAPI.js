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

export async function updateLanguage(code,language_data) {
  try {
    const response = await axios.put(`${BASE_URL}/languages/${code}`, language_data);
    console.log('Language updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to update language:', error);
    throw error;
  }
}

export async function getSpecificLanguage(code) {
  try {
    const response = await axios.get(`${BASE_URL}/languages/${code}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get language:', error);
    throw error;
  }
}

export async function deleteLanguage(code) {
  try {
    const response = await axios.delete(`${BASE_URL}/languages/${code}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete language:', error);
    throw error;
  }
}