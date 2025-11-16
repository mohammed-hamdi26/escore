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

export async function addTheme(theme) {
  try {
    const res = await axios.post("https://testsapis.pythonanywhere.com/api/v1/themes",theme);
    console.log("theme added" , res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to add theme",error);
    throw error
  }
}