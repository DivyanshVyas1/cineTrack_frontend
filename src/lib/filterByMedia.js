export const matchesMediaFilter = (item, filter) => {
  if (!filter || filter === "all") return true;
  const type = item?.movie?.type || item?.type;
  if (filter === "show") return type === "show" || type === "series";
  if (filter === "series") return type === "series" || type === "show";
  if (filter === "music") return type === "music";
  return type === filter;
};

export const filterFeedPosts = (feedGroups, filter, { hideSpoilers = false } = {}) => {
  return feedGroups
    .map(group => {
      // Handle the new grouped feed structure where each item is a user with a `posts` array
      if (group.posts && Array.isArray(group.posts)) {
        const filteredPosts = group.posts
          .filter((post) => matchesMediaFilter(post, filter))
          .filter((post) => (hideSpoilers ? !post.isSpoiler : true));
        return { ...group, posts: filteredPosts };
      }
      
      // Fallback for older flat structure just in case
      return group;
    })
    // If it's a grouped structure, only keep groups that have at least 1 post after filtering
    .filter(group => group.posts ? group.posts.length > 0 : (matchesMediaFilter(group, filter) && (hideSpoilers ? !group.isSpoiler : true)));
};

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
