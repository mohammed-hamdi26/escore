import axios from 'axios'

const BASE_URL="https://testsapis.pythonanywhere.com/api/v1"
export async function getDictionaryWords(code) {
  const res = await axios.get(`${BASE_URL}/languages/${code}/dictionary`)
  return res.data
}