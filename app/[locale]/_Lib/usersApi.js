import apiClient from "./apiCLient";

export async function getLoginUser() {
  try {
    const res = await apiClient.get("/users/profile");
    return res.data.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get user");
  }
}

export async function getUsers() {
  try {
    const res = await apiClient.get("/admin/users");
    console.log(res);
    return res.data.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get users");
  }
}
