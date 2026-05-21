import client from "../api/client";

export const createPost = async (payload) => {
  const { data } = await client.post("/posts", payload);
  return data.data;
};

export const getFeed = async () => {
  const { data } = await client.get("/posts/feed");
  return data.data || [];
};

export const updatePost = async (postId, payload) => {
  const { data } = await client.patch(`/posts/${postId}`, payload);
  return data.data;
};

export const deletePost = async (postId) => {
  const { data } = await client.delete(`/posts/${postId}`);
  return data.data;
};

export const togglePostFavorite = async (postId) => {
  const { data } = await client.post(`/posts/${postId}/favorite`);
  return data.data;
};
