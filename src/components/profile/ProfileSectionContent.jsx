import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { profileListItemVariants, profilePanelTransition } from "../../lib/motion";
import { buildTitleLink } from "../../lib/titleLink";
import GenreBreakdown from "./GenreBreakdown";
import PostCard from "./PostCard";
import FeedPost from "../feed/FeedPost";

function AnimatedItem({ children, index = 0 }) {
  return (
    <motion.div
      variants={profileListItemVariants}
      initial="initial"
      animate="animate"
      transition={{ ...profilePanelTransition, delay: index * 0.04 }}
    >
      {children}
    </motion.div>
  );
}

function ListItemCard({ movie, index }) {
  if (!movie) return null;
  return (
    <AnimatedItem index={index}>
      <article className="glass-card list-item-card">
        <Link to={buildTitleLink(movie)}>
          <h4>{movie.title}</h4>
        </Link>
        <span className="sidebar-muted">{movie.type}</span>
      </article>
    </AnimatedItem>
  );
}

const SECTION_GENRE_TITLES = {
  movies: "Movie genre mix",
  "web-shows": "Series genre mix",
  books: "Book genre mix",
};

function ProfileSectionContent({ data, section, tab, isOwner, profileUser, onRefresh, sortOrder = "desc", genreFilter = null, isFollowing = false }) {
  if (!data) return null;

  const filterAndSort = (items) => {
    let result = [...items];
    if (genreFilter) {
      result = result.filter(p => {
        const genres = p.movie?.genres || p.genres || [];
        return genres.includes(genreFilter);
      });
    }
    return result.sort((a, b) => {
      if (sortOrder === "newest" || sortOrder === "oldest") {
        const dateA = new Date(a.watchedOn || a.createdAt || 0).getTime();
        const dateB = new Date(b.watchedOn || b.createdAt || 0).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      }
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return sortOrder === "asc" ? ratingA - ratingB : ratingB - ratingA;
    });
  };

  const sortItems = filterAndSort;

  if (section === "watchlist") {
    const items = sortItems(data.items || []);
    return (
      <div className="profile-section-body">
        {items.length === 0 ? (
          <p className="sidebar-muted">
            {isOwner ? (
              <>
                Watchlist is empty. Add titles from the <Link to="/post">Post</Link> page.
              </>
            ) : (
              "Watchlist is empty."
            )}
          </p>
        ) : (
          <div className={tab === "music" ? "profile-posts-column" : "profile-posts-grid"} style={tab === "music" ? { display: "flex", flexDirection: "column", gap: "1.5rem" } : {}}>
            {items.map((entry, i) => (
              <AnimatedItem key={entry._id} index={i}>
                {tab === "music" ? (
                  <FeedPost post={{...entry, user: entry.user || profileUser, isOwnPost: isOwner, isFollowing: !isOwner && isFollowing}} onChanged={onRefresh} />
                ) : (
                  <PostCard post={entry} hideActions={true} isWatchlist={true} />
                )}
              </AnimatedItem>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (section === "favorites") {
    const listItems = sortItems(data.items || []);
    return (
      <div className="profile-section-body">
        {listItems.length === 0 ? (
          <p className="sidebar-muted">
            {isOwner
              ? "No favourites yet. Mark as favourite when logging a post."
              : "No favourites in this category."}
          </p>
        ) : (
          <div className={tab === "music" ? "profile-posts-column" : "profile-posts-grid"} style={tab === "music" ? { display: "flex", flexDirection: "column", gap: "1.5rem" } : {}}>
            {listItems.map((entry, i) => (
              <AnimatedItem key={entry._id} index={i}>
                {tab === "music" ? (
                  <FeedPost post={{...entry, user: entry.user || profileUser, isOwnPost: isOwner, isFollowing: !isOwner && isFollowing}} onChanged={onRefresh} />
                ) : (
                  <PostCard post={entry} canEdit={isOwner} onChanged={onRefresh} />
                )}
              </AnimatedItem>
            ))}
          </div>
        )}
      </div>
    );
  }

  const posts = sortItems(data.items || []);

  return (
    <div className="profile-section-body">

      {posts.length === 0 ? (
        <p className="sidebar-muted">
          {isOwner ? (
            <>
              Nothing logged yet. <Link to="/post">Post</Link> your first title.
            </>
          ) : (
            "Nothing logged in this category yet."
          )}
        </p>
      ) : (
        <div className={tab === "music" ? "profile-posts-column" : "profile-posts-grid"} style={tab === "music" ? { display: "flex", flexDirection: "column", gap: "1.5rem" } : {}}>
          {posts.map((p, i) => (
            <AnimatedItem key={p._id} index={i}>
              {tab === "music" ? (
                <FeedPost post={{...p, user: p.user || profileUser, isOwnPost: isOwner, isFollowing: !isOwner && isFollowing}} onChanged={onRefresh} />
              ) : (
                <PostCard post={p} canEdit={isOwner} onChanged={onRefresh} />
              )}
            </AnimatedItem>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProfileSectionContent;
