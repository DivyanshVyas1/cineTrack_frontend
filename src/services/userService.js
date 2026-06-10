import client from "../api/client";

export const fetchProfile = async (username) => {
  const { data } = await client.get(`/users/${username}`);
  return data.data;
};

export const fetchMyProfile = async () => {
  const { data } = await client.get("/users/me");
  return data.data;
};

export const fetchUserReviews = async (username) => {
  const { data } = await client.get(`/users/${username}/reviews`);
  return data.data;
};

export const updatePrivacy = async (isPrivate) => {
  const { data } = await client.patch("/users/me/privacy", { isPrivate });
  return data.data;
};

export const updateMyProfile = async (payload) => {
  const { data } = await client.patch("/users/me/profile", payload);
  return data.data;
};

export const fetchCollection = async (username, tab, section) => {
  const { data } = await client.get(`/users/${username}/collection`, {
    params: { tab, section },
  });
  return data.data;
};

export const addToList = async (movieId, listType) => {
  const { data } = await client.post("/users/me/list", { movieId, listType });
  return data.data;
};

export const rateUserTaste = async (username, payload) => {
  const { data } = await client.post(`/users/${username}/taste`, payload);
  return data.data;
};

export const fetchTasteSuggestions = async () => {
  const { data } = await client.get("/users/suggestions/taste");
  return data.data || [];
};

export const fetchProfileComparison = async (username) => {
  const { data } = await client.get(`/users/${username}/compare`);
  return data.data;
};
