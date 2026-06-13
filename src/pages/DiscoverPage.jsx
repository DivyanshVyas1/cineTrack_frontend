import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import UserSearch from "../components/discover/UserSearch";
import MediaSearch from "../components/discover/MediaSearch";
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
      <div className="discover-grid-2">
        <UserSearch />
        <MediaSearch />
      </div>

      <section className="discover-span-full">
        <div style={{
          position: "relative",
          borderRadius: "16px",
          padding: "1.75rem 2rem",
          overflow: "hidden",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
          background: "linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(139,92,246,0.12) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)"
        }}>
          {/* Background blur shapes */}
          <div style={{
            position: "absolute", top: "-50%", left: "-10%", width: "200px", height: "200px",
            background: "#ec4899", filter: "blur(80px)", opacity: 0.25, zIndex: 0, borderRadius: "50%"
          }} />
          <div style={{
            position: "absolute", bottom: "-50%", right: "-10%", width: "250px", height: "250px",
            background: "#8b5cf6", filter: "blur(90px)", opacity: 0.25, zIndex: 0, borderRadius: "50%"
          }} />
          
          <div style={{ position: "relative", zIndex: 1, maxWidth: "600px" }}>
            <h3 style={{ 
              fontSize: "1.6rem", fontWeight: "800", marginBottom: "0.5rem", 
              background: "linear-gradient(to right, #fff, #e2e8f0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em"
            }}>
              Discover Reels & Shorts
            </h3>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", lineHeight: 1.5 }}>
              Swipe through endless vertical video recommendations based on trending movies and community tastes.
            </p>
          </div>
          
          <Link to="/reels" style={{
            position: "relative", zIndex: 1,
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "0.75rem 1.5rem",
            background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
            color: "#fff", textDecoration: "none",
            borderRadius: "12px", fontWeight: "700", fontSize: "0.95rem",
            boxShadow: "0 4px 15px rgba(236,72,153,0.3)",
            transition: "all 0.2s ease",
            textTransform: "uppercase", letterSpacing: "0.05em"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(236,72,153,0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(236,72,153,0.3)";
          }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play Reels
          </Link>
        </div>
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
          title="Most disliked characters"
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
