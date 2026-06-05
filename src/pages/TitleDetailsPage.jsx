import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Badge from "../components/ui/Badge";
import ProfileAddForm from "../components/profile/ProfileAddForm";
import ReviewCard from "../components/profile/ReviewCard";
import MusicAudioPlayer from "../components/post/MusicAudioPlayer";
import { useAuth } from "../hooks/useAuth";
import { getRateHeading, getMediaLabel } from "../lib/mediaLabels";
import { fetchTitleDetail } from "../services/titleService";
import { createMovie } from "../services/movieService";
import { addToList } from "../services/userService";

function TitleDetailsPage() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const type = searchParams.get("type") || "movie";
  const title = searchParams.get("title") || "";
  const externalId = searchParams.get("externalId") || "";

  const [info, setInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ count: 0, average: null });
  const [loading, setLoading] = useState(true);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (!title.trim()) {
      setLoading(false);
      return;
    }
    if (!isRefresh) setLoading(true);
    try {
      const data = await fetchTitleDetail({ type, title, externalId });
      setInfo(data.title);
      setReviews(data.reviews || []);
      setStats(data.stats || { count: 0, average: null });
    } catch (err) {
      toast.error(err.response?.data?.message || "Title not found");
      if (!isRefresh) setInfo(null);
    } finally {
      setLoading(false);
    }
  }, [type, title, externalId]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  if (loading) return <div className="glass-card page-card shimmer">Loading...</div>;
  if (!info) return <div className="glass-card page-card">Title not found.</div>;

  const isMusic = info.type === "music";
  const userReview = user ? reviews.find((r) => String(r.user?._id) === String(user._id)) : null;
  const hasUserReview = Boolean(userReview);
  const communityReviews = reviews.filter((r) => String(r.user?._id) !== String(user?._id));
  const avg = stats.average != null ? stats.average : "—";
  const mediaLabel = getMediaLabel(info.type);
  const postType = info.postType || (info.type === "show" ? "series" : info.type);
  const videoId = info.youtubeVideoId || info.externalId;
  const previewUrl =
    info.previewUrl || (videoId && isMusic ? `/api/music/preview/${videoId}` : "");

  const existingForForm = {
    title: info.title,
    type: info.type,
    postType,
    externalId: info.externalId,
    poster: info.poster,
    overview: info.artistName || "",
    artistName: info.artistName,
    duration: info.duration,
    previewUrl: info.previewUrl || "",
    youtubeVideoId: info.youtubeVideoId || "",
    genres: info.genres || [],
  };

  const handleWatchlist = async () => {
    setAddingToWatchlist(true);
    try {
      const created = await createMovie({
        title: info.title,
        type: postType,
        overview: info.overview || info.artistName || "",
        poster: info.poster || "",
        genres: isMusic ? [] : info.genres || [],
      });
      await addToList(created._id, "watchlist");
      toast.success("Added to watchlist");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to watchlist");
    } finally {
      setAddingToWatchlist(false);
    }
  };

  return (
    <div className="movie-page">
      <section
        className="movie-hero glass-card"
        style={{
          backgroundImage: info.backdrop
            ? `linear-gradient(rgba(5,8,22,0.85), rgba(5,8,22,0.95)), url(${info.backdrop})`
            : undefined,
        }}
      >
        <div className="movie-hero-grid">
          {info.poster ? (
            <img src={info.poster} alt={info.title} className="movie-poster-img" />
          ) : (
            <div className="movie-poster glass-card movie-poster-fallback">{info.title?.charAt(0)}</div>
          )}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
              <Badge variant="pink" style={{ textTransform: "capitalize" }}>{info.type}</Badge>
              {info.genres && info.genres.length > 0 ? (
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {info.genres.map(g => (
                    <span key={g} style={{ border: "1px solid var(--border)", padding: "0.1rem 0.6rem", borderRadius: "12px", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "capitalize" }}>
                      {g}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <h1 style={{ marginTop: 0 }}>{info.title}</h1>
            {isMusic && info.artistName ? <p className="title-page-artist">{info.artistName}</p> : null}
            {!isMusic && info.overview ? <p>{info.overview}</p> : null}
            
            {isMusic && (
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
                {previewUrl ? (
                  <div className="title-page-player" style={{ flexGrow: 1, margin: 0 }}>
                    <MusicAudioPlayer src={previewUrl} durationSeconds={info.duration} />
                  </div>
                ) : (
                  <div style={{ flexGrow: 1 }} />
                )}
                <a
                  href={`https://open.spotify.com/search/${encodeURIComponent(`${info.title || ""} ${info.artistName || ""}`.trim())}/tracks`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open in Spotify"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                    cursor: "pointer"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                  }}
                >
                  <img src="/spotify.png" alt="Spotify" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
                </a>
              </div>
            )}
            
            <div className="movie-meta" style={{ marginTop: "1rem" }}>
              <span>Cinescore {avg}/10</span>
              <span>{stats.count} community reviews</span>
            </div>
            {isAuthenticated ? (
              <button 
                onClick={handleWatchlist} 
                className="btn-primary" 
                style={{ marginTop: '1rem' }}
                disabled={addingToWatchlist}
              >
                {addingToWatchlist ? "Adding..." : "+ Add to Watchlist"}
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <div className="movie-content-grid">
        <section className="movie-main">
          {isAuthenticated && !hasUserReview ? (
            <ProfileAddForm
              existingMovie={existingForForm}
              defaultMediaType={postType === "show" ? "series" : postType}
              mode="log"
              heading={getRateHeading(info.type)}
              onPosted={() => load(true)}
            />
          ) : null}

          {isAuthenticated && hasUserReview ? (
            <div className="glass-card panel your-review-banner">
              <h3>Your Review</h3>
              <ReviewCard review={userReview} showAuthor={false} />
            </div>
          ) : null}

          {!isAuthenticated ? (
            <p className="sidebar-muted">
              <Link to="/login">Sign in</Link> to rate this {mediaLabel}.
            </p>
          ) : null}

          <h3>Community Reviews</h3>
          {communityReviews.length === 0 ? (
            <p className="sidebar-muted">
              No public reviews yet. Reviews from private profiles appear after you follow them.
            </p>
          ) : (
            communityReviews.map((r) => <ReviewCard key={r._id} review={r} showAuthor />)
          )}
        </section>
      </div>
    </div>
  );
}

export default TitleDetailsPage;
