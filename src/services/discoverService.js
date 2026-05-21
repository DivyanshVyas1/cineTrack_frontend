import client from "../api/client";

export const fetchTrendingCharacters = async () => {
  const { data } = await client.get("/discover/trending-characters");
  return data.data || { favorite: [], gandu: [] };
};

export const fetchDiscoverSummary = async () => {
  const { data } = await client.get("/discover/summary");
  return (
    data.data || {
      characters: { favorite: [], gandu: [] },
      topRatedSongs: [],
      trending: { movies: [], shows: [], books: [] },
    }
  );
};

export const fetchTopRatedSongs = async () => {
  const { data } = await client.get("/discover/top-rated-songs");
  return data.data || [];
};
