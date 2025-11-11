import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://db8f573bab41.ngrok-free.app/api",

  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc2NTI5NzkwMiwiYXV0aCI6IlJPTEVfQURNSU4gUk9MRV9VU0VSIiwiaWF0IjoxNzYyNzA1OTAyLCJ1c2VySWQiOjF9.nR79MkDFj9MyAVEtMEJgkRQBrKBHywjDyB7_Bq1hzCrqqF6mzoN7PshUAcAuPi0yOk_IfZ8QCDJrSADihsJyFQ",
  },
});
export default apiClient;
