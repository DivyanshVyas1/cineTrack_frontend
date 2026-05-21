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

  const load = useCallback(async () => {
    if (!title.trim()) {
      setLoading(false);
      return;
    }
    try {
      const data = await fetchTitleDetail({ type, title, externalId });
      setInfo(data.title);
      setReviews(data.reviews || []);
      setStats(data.stats || { count: 0, average: null });
    } catch (err) {
      toast.error(err.response?.data?.message || "Title not found");
      setInfo(null);
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
    genres: info.genres || [],
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
            <Badge variant="pink">{info.type}</Badge>
            <h1>{info.title}</h1>
            {isMusic && info.artistName ? <p className="title-page-artist">{info.artistName}</p> : null}
            {!isMusic ? <p>{info.overview || "No synopsis yet."}</p> : null}
            {isMusic && previewUrl ? (
              <div className="title-page-player">
                <MusicAudioPlayer src={previewUrl} durationSeconds={info.duration} />
              </div>
            ) : null}
            <div className="movie-meta">
              <span>Cinescore {avg}/10</span>
              <span>{stats.count} community reviews</span>
            </div>
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
              onPosted={load}
            />
          ) : null}

          {isAuthenticated && hasUserReview ? (
            <div className="glass-card panel your-review-banner">
              <h3>Your review</h3>
              <ReviewCard review={userReview} showAuthor={false} />
            </div>
          ) : null}

          {!isAuthenticated ? (
            <p className="sidebar-muted">
              <Link to="/login">Sign in</Link> to rate this {mediaLabel}.
            </p>
          ) : null}

          <h3>Community reviews</h3>
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
