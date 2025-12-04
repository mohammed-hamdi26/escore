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

export async function getUsers(searchParams = {}) {
  const searchParamsString = Object.entries(searchParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  console.log(searchParamsString);
  try {
    const res = await apiClient.get(`/admin/users?${searchParamsString}`);
    console.log(res);
    return { data: res.data.data, meta: res.data.meta };
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get users");
  }
}

export async function getUser(id) {
  try {
    const res = await apiClient.get(`/admin/users/${id}`);
    return res.data.data;
  } catch (e) {
    console.log(e.response);
    throw new Error("Failed to get user");
  }
}
