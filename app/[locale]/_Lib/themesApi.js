import axios from "axios";

const BASE_URL = "https://testsapis.pythonanywhere.com/api/v1";
export async function getAllThemes() {
  try {
    const res = await axios.get(`${BASE_URL}/themes`);
    return res.data;
  } catch {
    throw new Error("error while fetcing themes");
  }
}
