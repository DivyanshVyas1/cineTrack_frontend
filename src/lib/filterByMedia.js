export const matchesMediaFilter = (item, filter) => {
  if (!filter || filter === "all") return true;
  const type = item?.movie?.type || item?.type;
  if (filter === "show") return type === "show" || type === "series";
  if (filter === "series") return type === "series" || type === "show";
  if (filter === "music") return type === "music";
  return type === filter;
};

export const filterFeedPosts = (posts, filter, { hideSpoilers = false } = {}) =>
  posts
    .filter((post) => matchesMediaFilter(post, filter))
    .filter((post) => (hideSpoilers ? !post.isSpoiler : true));

export const filterTrending = (entries, filter) =>
  entries.filter((entry) => matchesMediaFilter(entry, filter));

export const filterFounderSuggestions = (data, filter) => {
  if (Array.isArray(data)) return data.filter((entry) => matchesMediaFilter(entry, filter));
  if (data && data.items) {
    return {
      matchedGenre: data.matchedGenre,
      items: data.items.filter((entry) => matchesMediaFilter(entry, filter))
    };
  }
  return { matchedGenre: null, items: [] };
};
