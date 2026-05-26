import client from "../api/client";
import { fetchTasteSuggestions } from "./userService";

export const getHomeFeed = async (isAuthenticated = false) => {
  const requests = [
    client.get("/posts/feed"),
    client.get("/founder-suggestions"),
    client.get("/movies/trending/week"),
  ];
  if (isAuthenticated) {
    requests.push(fetchTasteSuggestions().catch(() => []));
  }
  const results = await Promise.all(requests);
  return {
    feed: results[0].data.data || [],
    founderSuggestions: results[1].data.data || { matchedGenre: null, items: [] },
    trendingWeek: results[2].data.data || [],
    tasteSuggestions: isAuthenticated ? results[3] || [] : [],
  };
};
