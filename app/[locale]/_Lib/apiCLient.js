import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://423d4c25bb99.ngrok-free.app/api",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc2NDI2MDM2NSwiYXV0aCI6IlJPTEVfQURNSU4gUk9MRV9VU0VSIiwiaWF0IjoxNzYxNjY4MzY1LCJ1c2VySWQiOjF9.yyeM4NDT-SCaekKfQ3kVLa7ft9hgXrA5WWXV8gUTWalEaLxTa9U5uETmaxZsMKrLiexk6Ln6qQH25vbsG3vWDw",
  },
});
export default apiClient;
