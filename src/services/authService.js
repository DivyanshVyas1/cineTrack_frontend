import client from "../api/client";

export const loginUser = async (credentials) => {
  const { data } = await client.post("/auth/login", credentials);
  return data.data;
};

export const registerUser = async (payload) => {
  const { data } = await client.post("/auth/register", payload);
  return data.data;
};
