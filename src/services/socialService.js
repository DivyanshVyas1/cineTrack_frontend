import client from "../api/client";

export const toggleLike = async (postId) => {
  const { data } = await client.post(`/posts/${postId}/like`);
  return data.data;
};

export const fetchLikes = async (postId) => {
  const { data } = await client.get(`/posts/${postId}/likes`);
  return data.data;
};

export const fetchComments = async (postId) => {
  const { data } = await client.get(`/posts/${postId}/comments`);
  return data.data;
};

export const postComment = async (postId, text) => {
  const { data } = await client.post(`/posts/${postId}/comments`, { text });
  return data.data;
};

export const followUser = async (username) => {
  const { data } = await client.post(`/users/${username}/follow`);
  return data.data;
};

export const unfollowUser = async (username) => {
  const { data } = await client.delete(`/users/${username}/follow`);
  return data.data;
};

export const removeFollower = async (username) => {
  const { data } = await client.delete(`/users/me/followers/${username}`);
  return data.data;
};

export const cancelFollowRequest = async (username) => {
  const { data } = await client.delete(`/users/${username}/follow-request`);
  return data.data;
};

export const fetchFollowRequests = async () => {
  const { data } = await client.get("/users/me/follow-requests");
  return data.data || [];
};

export const acceptFollowRequest = async (requestId) => {
  const { data } = await client.post(`/users/me/follow-requests/${requestId}/accept`);
  return data.data;
};

export const rejectFollowRequest = async (requestId) => {
  const { data } = await client.delete(`/users/me/follow-requests/${requestId}`);
  return data.data;
};

export const fetchFollowers = async (username) => {
  const { data } = await client.get(`/users/${username}/followers`);
  return data.data;
};

export const fetchFollowing = async (username) => {
  const { data } = await client.get(`/users/${username}/following`);
  return data.data;
};

export const updateFavoriteCharacters = async (characters) => {
  const { data } = await client.patch("/users/me/characters", { characters });
  return data.data;
};
