import apiClient from "./apiCLient";

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
