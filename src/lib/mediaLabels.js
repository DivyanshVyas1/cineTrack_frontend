export const getRateHeading = (type) => {
  if (type === "show") return "Rate this show";
  if (type === "book") return "Rate this book";
  if (type === "music") return "Rate this track";
  return "Rate this movie";
};

export const getMediaLabel = (type) => {
  if (type === "show") return "show";
  if (type === "book") return "book";
  if (type === "music") return "track";
  return "movie";
};
