import apiClient from "./apiCLient";

// Public function to get privacy content (no auth required)
export async function getPublicPrivacyContent(languageCode) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/settings/privacy/${languageCode}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!res.ok) {
      return { data: null };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching privacy content:", error);
    return { data: null };
  }
}

// export async function getPrivacyContent(language_code) {
//   try {
//     const res = await apiClient.get(`/v1/privacy/${language_code}`, {
//       headers: {
//         "ngrok-skip-browser-warning": "true",
//       },
//     });
//     return res.data;
//   } catch (error) {
//
//     throw error;
//   }
// }
// export async function addPrivacyContent(language_code, content) {
//   try {
//     const res = await apiClient.post(
//       `/v1/privacy`,
//       { languageCode: language_code, content: content },
//       {
//         headers: {
//           "ngrok-skip-browser-warning": "true",
//         },
//       }
//     );
//
//     return res.data;
//   } catch (error) {
//
//     throw error;
//   }
// }

// export async function deletePrivacyContent(language_code) {
//   try {
//     const res = await apiClient.delete(`/v1/privacy/${language_code}`, {
//       headers: {
//         "ngrok-skip-browser-warning": "true",
//       },
//     });
//
//     return res.data;
//   } catch (error) {
//
//     throw error;
//   }
// }

// export async function updatePrivacyContent(language_code, content) {
//   try {
//     const res = await apiClient.patch(
//       `/v1/privacy/${language_code}`,
//       { languageCode: language_code, content: content },
//       {
//         headers: {
//           "ngrok-skip-browser-warning": "true",
//         },
//       }
//     );
//
//     return res.data;
//   } catch (error) {
//
//     throw error;
//   }
// }
