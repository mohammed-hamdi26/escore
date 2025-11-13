import axios from 'axios'

const BASE_URL="https://testsapis.pythonanywhere.com/api/v1/languages"
export async function getDictionaryWords(code) {
  const res = await axios.get(`https://testsapis.pythonanywhere.com/api/v1/languages/${code}/dictionary`)
  return res.data
}