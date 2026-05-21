import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { profileListItemVariants, profilePanelTransition } from "../../lib/motion";
import { buildTitleLink } from "../../lib/titleLink";
import GenreBreakdown from "./GenreBreakdown";
import PostCard from "./PostCard";

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

function ProfileSectionContent({ data, section, tab, isOwner, onRefresh }) {
  if (!data) return null;

  if (section === "watchlist") {
    const items = data.items || [];
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
          items.map((entry, i) => <ListItemCard key={entry._id} movie={entry.movie} index={i} />)
        )}
      </div>
    );
  }

  if (section === "favorites") {
    const listItems = data.items || [];
    return (
      <div className="profile-section-body">
        {listItems.length === 0 ? (
          <p className="sidebar-muted">
            {isOwner
              ? "No favourites yet. Mark as favourite when logging a post."
              : "No favourites in this category."}
          </p>
        ) : (
          listItems.map((entry, i) => <ListItemCard key={entry._id} movie={entry.movie} index={i} />)
        )}
      </div>
    );
  }

  const posts = data.items || [];
  const isMusicTab = tab === "music";
  const genreTitle = SECTION_GENRE_TITLES[tab] || "Genre mix";

  return (
    <div className="profile-section-body">
      {isMusicTab ? (
        <p className="sidebar-muted music-no-genres-note">Music posts have no genre breakdown.</p>
      ) : (
        <GenreBreakdown stats={data.genreStats} title={genreTitle} />
      )}

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
        posts.map((p, i) => (
          <AnimatedItem key={p._id} index={i}>
            <PostCard post={p} canEdit={isOwner} onChanged={onRefresh} />
          </AnimatedItem>
        ))
      )}
    </div>
  );
}

export default ProfileSectionContent;
