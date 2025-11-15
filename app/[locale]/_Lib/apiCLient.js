import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://be7af6aff19d.ngrok-free.app/api",

  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc2NTIzMzMxMSwiYXV0aCI6IlJPTEVfQURNSU4gUk9MRV9VU0VSIiwiaWF0IjoxNzYyNjQxMzExLCJ1c2VySWQiOjF9.rGHxRTMtYmKfbTS2oBD04qyF4A0ZzUwouacKAaz3gHrOU8f1x3aThO1vdIk2NoHigBO_GszoI2eJ9BF7ZbrN0A",
  },
});
export default apiClient;
