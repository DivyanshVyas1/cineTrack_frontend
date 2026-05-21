import client from "../api/client";

export const searchMovies = async (search = "", type) => {
  const { data } = await client.get("/movies", { params: { search, limit: 8, type } });
  return data.data?.items || [];
};

export const fetchMediaSuggestions = async (query, type) => {
  const { data } = await client.get("/search", {
    params: { query, type },
  });
  return data.data || [];
};

export const createMovie = async (payload) => {
  const { data } = await client.post("/movies", payload);
  return data.data;
};

export const fetchMovie = async (id) => {
  const { data } = await client.get(`/movies/${id}`);
  return data.data;
};

export const fetchMovieReviews = async (id) => {
  const { data } = await client.get(`/movies/${id}/reviews`);
  return data.data;
};

export const fetchTrendingWeek = async () => {
  const { data } = await client.get("/movies/trending/week");
  return data.data || [];
};
