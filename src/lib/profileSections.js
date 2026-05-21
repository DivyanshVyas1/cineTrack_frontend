export const PROFILE_TABS = [
  { id: "movies", label: "Movies", mediaType: "movie" },
  { id: "web-shows", label: "Web Shows", mediaType: "series" },
  { id: "books", label: "Books", mediaType: "book" },
  { id: "music", label: "Music", mediaType: "music" },
];

export const PROFILE_SECTIONS = [
  { id: "all", label: "All" },
  { id: "watchlist", label: "Watchlist" },
  { id: "favorites", label: "Favorites" },
];

export const POST_ACTIONS = [
  { id: "log", label: "Log post", mode: "log" },
  { id: "watchlist", label: "Watchlist", mode: "watchlist" },
];

export const getMediaTypeForTab = (tab) =>
  PROFILE_TABS.find((t) => t.id === tab)?.mediaType || "movie";

/** Taste ratings still use movie | show | book in DB */
export const getTasteMediaTypeForTab = (tab) => {
  const type = getMediaTypeForTab(tab);
  return type === "series" ? "show" : type;
};
