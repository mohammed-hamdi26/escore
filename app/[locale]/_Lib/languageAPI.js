import apiClient from "./apiCLient";

export async function getLanguages() {
  try {
    const res = await apiClient.get(`/settings/languages`);
    return res.data;
  } catch (error) {
    console.error(error.response.data.errors || error.response.data || error);
    throw error;
  }
}

export async function getSpecificLanguage(code) {
  try {
    const response = await apiClient.get(`/settings/languages/${code}`);

    return response.data;
  } catch (error) {
    console.error("Failed to get language:", error);
    throw error;
  }
}

// export async function deleteLanguage(code) {
//   try {
//     const response = await axios.delete(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/languages/${code}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Failed to delete language:", error);
//     throw error;
//   }
// }
