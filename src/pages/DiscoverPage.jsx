import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import UserSearch from "../components/discover/UserSearch";
import DiscoverTitleCard from "../components/discover/DiscoverTitleCard";
import Badge from "../components/ui/Badge";
import { buildTitleLink } from "../lib/titleLink";
import { fetchDiscoverSummary } from "../services/discoverService";
import { getHomeFeed } from "../services/feedService";

function TrendingCharacterGrid({ title, subtitle, items, variant }) {
  return (
    <section className={`discover-panel discover-characters discover-characters-${variant}`}>
      <div className="discover-panel-head">
        <h3>{title}</h3>
        <p className="sidebar-muted">{subtitle}</p>
      </div>
      {items.length === 0 ? (
        <p className="sidebar-muted">No entries yet. Add yours in Edit profile.</p>
      ) : (
        <div className="trending-characters-grid">
          {items.map((entry, i) => (
            <div key={`${entry.name}-${entry.source}-${i}`} className="glass-card trending-character-card">
              <div className="trending-character-rank">#{i + 1}</div>
              <div className="trending-character-text">
                <span className="trending-character-name">{entry.name}</span>
                {entry.source ? (
                  <span className="trending-character-source">{entry.source}</span>
                ) : null}
              </div>
              <Badge variant={variant === "gandu" ? "amber" : "blue"}>
                {entry.count} {entry.count === 1 ? "profile" : "profiles"}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function TrendingRow({ title, subtitle, items, emptyHint }) {
  return (
    <section className="discover-panel">
      <div className="discover-panel-head">
        <h3>{title}</h3>
        <p className="sidebar-muted">{subtitle}</p>
      </div>
      {items.length === 0 ? (
        <p className="sidebar-muted">{emptyHint}</p>
      ) : (
        <div className="discover-titles-row">
          {items.map((entry, i) => (
            <DiscoverTitleCard
              key={`${entry.title?.title}-${entry.title?.externalId}-${i}`}
              entry={entry}
              badgeLabel={i < 3 ? "Hot" : null}
              badgeVariant={i === 0 ? "blue" : i === 1 ? "pink" : "green"}
              meta={`${entry.watchedCount} watches · ${Number(entry.avgRating || 0).toFixed(1)} avg`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function DiscoverPage() {
  const [summary, setSummary] = useState({
    characters: { favorite: [], gandu: [] },
    topRatedSongs: [],
    trending: { movies: [], shows: [], books: [] },
  });
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [discoverData, feedData] = await Promise.all([
          fetchDiscoverSummary(),
          getHomeFeed(),
        ]);
        setSummary(discoverData);
        setDiscussions((feedData.feed || []).slice(0, 6));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load discover");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="glass-card page-card shimmer">Loading discover...</div>;

  return (
    <div className="discover-page">
      <section className="discover-span-full discover-hero glass-card">
        <h1>Discover</h1>
        <p>Community picks, trending titles, and top-rated music.</p>
      </section>

      <section className="discover-span-full">
        <UserSearch />
      </section>

      <section className="discover-panel discover-panel-highlight">
        <div className="discover-panel-head">
          <h3>Top rated songs</h3>
          <p className="sidebar-muted">Highest community scores for music tracks</p>
        </div>
        {summary.topRatedSongs.length === 0 ? (
          <p className="sidebar-muted">No music ratings yet. Post a song review to appear here.</p>
        ) : (
          <div className="discover-titles-row discover-songs-row">
            {summary.topRatedSongs.map((entry, i) => (
              <DiscoverTitleCard
                key={`song-${entry.title?.externalId}-${i}`}
                entry={entry}
                badgeLabel={`${entry.avgRating}/10`}
                badgeVariant="blue"
                meta={`${entry.ratingCount} ${entry.ratingCount === 1 ? "rating" : "ratings"}`}
              />
            ))}
          </div>
        )}
      </section>

      <div className="discover-grid-2">
        <TrendingRow
          title="Trending movies"
          subtitle="Most logged this week"
          items={summary.trending.movies}
          emptyHint="No movie activity this week yet."
        />
        <TrendingRow
          title="Trending web shows"
          subtitle="Series the community is watching"
          items={summary.trending.shows}
          emptyHint="No show activity this week yet."
        />
      </div>

      <div className="discover-grid-2">
        <TrendingCharacterGrid
          title="Favourite characters"
          subtitle="Most listed fictional favourites"
          items={summary.characters.favorite}
          variant="favorite"
        />
        <TrendingCharacterGrid
          title="Most disgusting characters"
          subtitle="Chaotic character picks"
          items={summary.characters.gandu}
          variant="gandu"
        />
      </div>

      <TrendingRow
        title="Trending books"
        subtitle="What readers are logging"
        items={summary.trending.books}
        emptyHint="No book activity this week yet."
      />

      <section className="discover-panel discover-span-full">
        <div className="discover-panel-head">
          <h3>Recent discussions</h3>
          <p className="sidebar-muted">Latest posts from the feed</p>
        </div>
        <div className="discussions-grid">
          {discussions.map((post) => {
            const href = buildTitleLink(post);
            return (
              <article key={post._id} className="glass-card discussion-card">
                <div className="discussion-top">
                  <Link to={`/profile/${post.user?.username}`}>{post.user?.name}</Link>
                  <Badge variant="blue">{post.rating}/10</Badge>
                </div>
                <Link to={href} className="discussion-title-link">
                  {post.movie?.title || post.title}
                </Link>
                <p>{post.note || "Shared a rating."}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default DiscoverPage;
