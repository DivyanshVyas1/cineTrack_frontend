import client from "../api/client";

export const fetchSearchSuggestions = async (query, type) => {
  const { data } = await client.get("/search", {
    params: { query, type },
  });
  return data.data || [];
};

export const searchMusic = async (query) => fetchSearchSuggestions(query, "music");

export const searchUsers = async (q) => {
  const { data } = await client.get("/search/users", { params: { q } });
  return data.data || [];
};
