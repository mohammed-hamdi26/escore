import axios from 'axios'

const BASE_URL="https://testsapis.pythonanywhere.com/api/v1"
export async function getDictionaryWords(code) {
  const res = await axios.get(`${BASE_URL}/languages/${code}/dictionary`)
  return res.data
}

export async function addToDictionary(word) {
  try {
    const response = await axios.post(`${BASE_URL}/languages/${code}/dictionary `, word);
    console.log('word added:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to add word:', error);
    throw error;
  }
}

export async function updateWord(code, word, translation) {
  try {
    const response = await axios.put(`${BASE_URL}/languages/${code}/dictionary/${word}`, translation);
    console.log('word translation updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to update word translation', error);
    throw error;
  }
}

export async function deleteWord(code,word) {
  try {
    const response = await axios.delete(`${BASE_URL}/languages/${code}/dictionary/${word}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete word:', error);
    throw error;
  }
}