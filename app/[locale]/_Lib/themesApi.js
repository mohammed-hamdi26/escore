import axios from "axios";
export async function getAllThemes() {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/themes`,{
      headers :{
        Authorization :`Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
      }
    });
    return res.data;
  } catch {
    throw new Error("error while fetcing themes");
  }
}

export async function addTheme(theme) {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/themes`,theme,{
      headers : {
        Authorization : `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`
      }
    });
    console.log("theme added" , res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to add theme",error);
    throw error
  }
}
export async function updateTheme(theme,theme_id) {
  try {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/themes/${theme_id}`,theme,{
      headers : {
        Authorization : `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`
      }
    });
    console.log("theme updated" , res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to add theme",error);
    throw error
  }
}
export async function deleteTheme(theme_id) {
  try {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/themes/${theme_id}`,{
      headers : {
        Authorization : `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`
      }
    });
    console.log("theme deleted" , res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to add theme",error);
    throw error
  }
}