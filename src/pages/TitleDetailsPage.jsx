import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Badge from "../components/ui/Badge";
import ProfileAddForm from "../components/profile/ProfileAddForm";
import ReviewCard from "../components/profile/ReviewCard";
import MusicAudioPlayer from "../components/post/MusicAudioPlayer";
import TrailerModal from "../components/title/TrailerModal";
import WatchProviders from "../components/title/WatchProviders";
import CastRow from "../components/title/CastRow";
import SimilarTitles from "../components/title/SimilarTitles";
import { useAuth } from "../services/useAuth";
import { getRateHeading, getMediaLabel } from "../utils/mediaLabels";
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
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (!title.trim()) { setLoading(false); return; }
    if (!isRefresh) setLoading(true);
    try {
      const data = await fetchTitleDetail({ type, title, externalId });
      setInfo(data.title);
      setReviews(data.reviews || []);
      setStats(data.stats || { count: 0, average: null });
      setInWatchlist(data.inWatchlist || false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Title not found");
      if (!isRefresh) setInfo(null);
    } finally {
      setLoading(false);
    }
  }, [type, title, externalId]);

  useEffect(() => { setLoading(true); load(); }, [load]);

  if (loading) return <div className="glass-card page-card shimmer" style={{ minHeight: "60vh" }}>Loading...</div>;
  if (!info) return <div className="glass-card page-card">Title not found.</div>;

  const isMusic = info.type === "music";
  const userReview = user ? reviews.find((r) => String(r.user?._id) === String(user._id)) : null;
  const hasUserReview = Boolean(userReview);
  const communityReviews = reviews.filter((r) => String(r.user?._id) !== String(user?._id));
  const avg = stats.average != null ? stats.average : "—";
  const mediaLabel = getMediaLabel(info.type);
  const postType = info.postType || (info.type === "show" ? "series" : info.type);
  const videoId = info.youtubeVideoId || info.externalId;
  const previewUrl = info.previewUrl || (videoId && isMusic ? `/api/music/preview/${videoId}` : "");
  const hasEnrichedData = !isMusic && (info.trailer || info.watchProviders?.length || info.cast?.length || info.recommendations?.length);

  const existingForForm = {
    title: info.title, type: info.type, postType,
    externalId: info.externalId, poster: info.poster,
    overview: info.artistName || "", artistName: info.artistName,
    duration: info.duration, previewUrl: info.previewUrl || "",
    youtubeVideoId: info.youtubeVideoId || "", genres: info.genres || [],
  };

  const handleWatchlist = async () => {
    setAddingToWatchlist(true);
    try {
      const created = await createMovie({ title: info.title, type: postType, overview: info.overview || info.artistName || "", poster: info.poster || "", genres: isMusic ? [] : info.genres || [] });
      await addToList(created._id, "watchlist");
      setInWatchlist(true);
      toast.success("Added to watchlist");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to watchlist");
    } finally {
      setAddingToWatchlist(false);
    }
  };

  return (
    <div className="tdp-page">

      {/* ── HERO ── */}
      <div
        className="tdp-hero"
        style={{
          backgroundImage: info.backdrop
            ? `linear-gradient(to bottom, rgba(5,8,22,0.55) 0%, rgba(5,8,22,0.9) 70%, #050816 100%), url(${info.backdrop})`
            : "linear-gradient(135deg, #0d0d1a, #1a0d2e)",
        }}
      >
        <div className="tdp-hero-inner">
          {/* Poster */}
          <div className="tdp-poster-wrap">
            {info.poster ? (
              <img src={info.poster} alt={info.title} className="tdp-poster" />
            ) : (
              <div className="tdp-poster tdp-poster-fallback">{info.title?.charAt(0)}</div>
            )}
            {info.trailer && (
              <TrailerModal trailerKey={info.trailer.key} trailerName={info.trailer.name}>
                <div className="tdp-poster-play" title="Play Trailer">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </TrailerModal>
            )}
          </div>

          {/* Info — title + genres + overview only */}
          <div className="tdp-info">
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.5rem", overflow: "hidden", maxHeight: "3.2rem" }}>
              <Badge variant="pink" style={{ textTransform: "capitalize", flexShrink: 0 }}>{info.type}</Badge>
              {(info.genres || []).slice(0, 3).map(g => (
                <span key={g} className="tdp-genre-chip">{g}</span>
              ))}
            </div>

            <h1 className="tdp-title">{info.title}</h1>
            {isMusic && info.artistName && <p className="tdp-artist">{info.artistName}</p>}

            {/* Overview */}
            {!isMusic && info.overview && (
              <div style={{ marginBottom: "0.4rem" }}>
                <p
                  className="tdp-overview"
                  style={overviewExpanded ? { WebkitLineClamp: "unset", display: "block", overflow: "visible" } : {}}
                >
                  {info.overview}
                </p>
                <button
                  onClick={() => setOverviewExpanded(v => !v)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#60a5fa", fontSize: "0.78rem", fontWeight: 700, padding: "2px 0", marginTop: "2px" }}
                >
                  {overviewExpanded ? "Show less ↑" : "Read more..."}
                </button>
              </div>
            )}

            {/* Music player */}
            {isMusic && (
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
                {previewUrl && (
                  <div className="title-page-player" style={{ flexGrow: 1, margin: 0 }}>
                    <MusicAudioPlayer src={previewUrl} durationSeconds={info.duration} />
                  </div>
                )}
                <a
                  href={`https://open.spotify.com/search/${encodeURIComponent(`${info.title || ""} ${info.artistName || ""}`.trim())}`}
                  target="_blank" rel="noopener noreferrer"
                  className="tdp-spotify-btn"
                >
                  <img src="/spotify.png" alt="Spotify" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom bar: CineScore + Buttons (full width, below grid) ── */}
        <div className="tdp-hero-bottom">
          {/* Score */}
          <div className="tdp-score-row" style={{ margin: 0 }}>
            {stats.average != null ? (
              <>
                <div className="tdp-score-badge">
                  <span className="tdp-score-num">{stats.average}</span>
                  <span className="tdp-score-denom">/10</span>
                  <span className="tdp-score-label">CineScore</span>
                </div>
                <div className="tdp-score-divider" />
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
                  <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem" }}>{stats.count}</span> reviews
                </div>
              </>
            ) : (
              <span style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.32)", fontWeight: 600 }}>
                No CineTrack score yet — be first!
              </span>
            )}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Buttons side by side */}
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            {isAuthenticated && !hasUserReview && (
              <button
                onClick={handleWatchlist}
                className={inWatchlist ? "btn-ghost" : "btn-primary"}
                disabled={addingToWatchlist || inWatchlist}
                style={{ borderRadius: "100px", fontSize: "0.8rem", padding: "0.5rem 1rem", flexShrink: 0 }}
              >
                {addingToWatchlist ? "Adding…" : inWatchlist ? "✓ Watchlist" : "+ Watchlist"}
              </button>
            )}
            {info.trailer && (
              <TrailerModal trailerKey={info.trailer.key} trailerName={info.trailer.name}>
                <button className="tdp-trailer-btn" style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  Trailer
                </button>
              </TrailerModal>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="tdp-body">

        {/* Where to Watch */}
        {!isMusic && info.watchProviders?.length > 0 && (
          <WatchProviders providers={info.watchProviders} title={info.title} />
        )}

        {/* Cast & Crew */}
        {!isMusic && (info.cast?.length > 0 || info.crew?.length > 0) && (
          <CastRow cast={info.cast || []} crew={info.crew || []} />
        )}

        {/* Rate / Log form */}
        {isAuthenticated && !hasUserReview && (
          <div className="tdp-section">
            <ProfileAddForm
              existingMovie={existingForForm}
              defaultMediaType={postType === "show" ? "series" : postType}
              mode="log"
              heading={getRateHeading(info.type)}
              onPosted={() => load(true)}
            />
          </div>
        )}

        {/* Your review */}
        {isAuthenticated && hasUserReview && (
          <div className="tdp-section">
            <h3 className="tdp-section-title">Your Review</h3>
            <ReviewCard review={userReview} showAuthor={false} />
          </div>
        )}

        {/* Sign-in prompt */}
        {!isAuthenticated && (
          <div className="tdp-section">
            <p className="sidebar-muted"><Link to="/login">Sign in</Link> to rate this {mediaLabel}.</p>
          </div>
        )}

        {/* Community Reviews */}
        <div className="tdp-section">
          <h3 className="tdp-section-title">Community Reviews</h3>
          {communityReviews.length === 0 ? (
            <p className="sidebar-muted">No public reviews yet. Reviews from private profiles appear after you follow them.</p>
          ) : (
            communityReviews.map((r) => <ReviewCard key={r._id} review={r} showAuthor />)
          )}
        </div>

        {/* You Might Also Like */}
        {!isMusic && info.recommendations?.length > 0 && (
          <SimilarTitles recommendations={info.recommendations} />
        )}
      </div>
    </div>
  );
}

export default TitleDetailsPage;
