import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import FollowButton from "../social/FollowButton";
import LikesModal from "../social/LikesModal";
import PostOwnerToolbar from "../post/PostOwnerToolbar";
import MusicPostExtras from "../post/MusicPostExtras";
import { buildTitleLink } from "../../lib/titleLink";
import PostRatingBadge from "../post/PostRatingBadge";
import { toggleLike, fetchComments, postComment } from "../../services/socialService";
import { getGenreColor } from "../../lib/colors";

const commentsTransition = { duration: 0.28, ease: [0.4, 0, 0.2, 1] };

function RatingBadge({ rating }) {
  if (rating == null || rating === "") return null;
  const r = parseFloat(rating);
  const color =
    r >= 8.5 ? "#4ade80" :
    r >= 7   ? "#fbbf24" :
    r >= 5   ? "#fb923c" :
               "#f87171";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "3px",
      padding: "3px 8px", borderRadius: "6px",
      background: "rgba(0,0,0,0.5)",
      border: `1px solid ${color}55`,
      color, fontSize: "0.8rem", fontWeight: "800",
      backdropFilter: "blur(6px)",
      letterSpacing: "0.02em",
    }}>
      <span style={{ fontSize: "0.72rem" }}>★</span>{r.toFixed(1)}
    </span>
  );
}

function FeedPost({ post, onChanged }) {
  const { isAuthenticated } = useAuth();
  const [posterHovered, setPosterHovered] = useState(false);
  const movie = post.movie;
  const author = post.user;
  const isMusic = post.type === "music" || movie?.type === "music";

  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [likesOpen, setLikesOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localFollowing, setLocalFollowing] = useState(post.isFollowing);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info("Sign in to like posts");
      return;
    }
    // Optimistic update: flip immediately
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    try {
      const result = await toggleLike(post._id);
      // Sync with real server values
      setLiked(result.liked);
      setLikesCount(result.likesCount);
    } catch (err) {
      // Revert on failure
      setLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error(getApiErrorMessage(err, "Like failed"));
    }
  };

  const loadComments = async () => {
    const data = await fetchComments(post._id);
    setComments(data);
    setCommentsCount(data.length);
  };

  const toggleComments = async () => {
    if (commentsOpen) {
      setCommentsOpen(false);
      return;
    }
    setCommentsLoading(true);
    try {
      await loadComments();
      setCommentsOpen(true);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to load comments"));
    } finally {
      setCommentsLoading(false);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isAuthenticated) {
      toast.info("Sign in to comment");
      return;
    }
    setSubmitting(true);
    try {
      await postComment(post._id, commentText.trim());
      setCommentText("");
      await loadComments();
      if (!commentsOpen) setCommentsOpen(true);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Comment failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}
        transition={{ duration: 0.2 }}
        className={`glass-card feed-card feed-post ${localFollowing ? "feed-post-following" : ""}`}
      >
        <header className="feed-post-header">
          <Link to={`/profile/${author?.username}`} className="feed-author">
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                position: "absolute", inset: "-2px", borderRadius: "0.7rem",
                background: "linear-gradient(135deg, rgba(255,42,133,0.2), rgba(120,80,255,0.2))",
                filter: "blur(4px)", zIndex: 0,
              }} />
              <div style={{ position: "relative", zIndex: 1, borderRadius: "0.6rem", overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.08)" }}>
                <Avatar name={author?.name} src={author?.avatar} size={36} />
              </div>
              
              {/* Top Badges Overlay */}
              {author?.topBadges?.length > 0 && (
                <div style={{ 
                  position: "absolute", top: "-4px", right: "-4px", 
                  display: "flex", gap: "2px", zIndex: 2 
                }}>
                  {author.topBadges.slice(0, 2).map((badge, i) => {
                    const glowSpread = badge.tierName === 'diamond' ? '9px' : badge.tierName === 'gold' ? '6px' : badge.tierName === 'silver' ? '3px' : '0';
                    const shadow = badge.tierName === 'bronze'
                      ? 'inset 0 0 2px rgba(255,255,255,0.3)'
                      : badge.tierName === 'heroic'
                      ? `0 0 12px ${badge.glow}, 0 0 20px ${badge.glow}, inset 0 0 4px rgba(255,255,255,0.6)`
                      : `0 0 ${glowSpread} ${badge.glow}, inset 0 0 2px rgba(255,255,255,0.3)`;
                      
                    return (
                      <div
                        key={badge.trackId}
                        title={`${badge.tierName.toUpperCase()} - ${badge.trackId}`}
                        style={{
                          width: "16px", height: "16px",
                          borderRadius: "50%",
                          background: badge.bg,
                          border: `1px solid ${badge.border}`,
                          boxShadow: shadow,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.55rem",
                          zIndex: 2 - i,
                          marginLeft: i > 0 ? "-6px" : "0"
                        }}
                      >
                        {badge.icon}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div>
              <strong>{author?.name}</strong>
              <span>@{author?.username}</span>
            </div>
          </Link>
          <div className="feed-header-actions">
            {!post.isOwnPost ? (
              <FollowButton
                username={author?.username}
                initialFollowing={post.isFollowing}
                compact
                onChange={({ following }) => setLocalFollowing(following)}
              />
            ) : null}
            {post.isOwnPost ? (
              <PostOwnerToolbar post={post} onChanged={onChanged} menuOnly />
            ) : null}
          </div>
        </header>

        {!isMusic ? (
          <div className="feed-post-main-layout">
            <Link
              to={buildTitleLink(post)}
              className="feed-post-poster-link"
              onMouseEnter={() => setPosterHovered(true)}
              onMouseLeave={() => setPosterHovered(false)}
              style={{ borderRadius: "0.6rem", overflow: "hidden", display: "block", flexShrink: 0 }}
            >
              {(movie?.poster || movie?.backdrop) ? (
                <img
                  src={movie.poster || movie.backdrop}
                  alt={movie?.title || post.title}
                  className="feed-post-poster"
                  style={{
                    transition: "transform 0.35s ease",
                    transform: posterHovered ? "scale(1.06)" : "scale(1)",
                    display: "block",
                  }}
                />
              ) : (
                <div className="feed-post-poster feed-post-poster-fallback">No image</div>
              )}
            </Link>
            <div className="feed-post-content">
              <div className="feed-post-meta">
                {movie?.type ? (
                  <Badge variant="pink">
                    {movie.type === "show" || movie.type === "series" ? "Webseries" : movie.type.charAt(0).toUpperCase() + movie.type.slice(1)}
                  </Badge>
                ) : null}
                {movie?.genres?.length ? (
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {movie.genres.slice(0, 3).map(g => {
                      const colors = getGenreColor(g);
                      return (
                        <span key={g} style={{ flexShrink: 0, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "1px 8px", fontSize: "0.7rem", color: colors.color, background: colors.bg, whiteSpace: "nowrap" }}>
                          {g}
                        </span>
                      );
                    })}
                  </div>
                ) : null}
                {post.isSpoiler ? <Badge variant="amber">Spoiler</Badge> : null}
              </div>

              <Link to={buildTitleLink(post)} className="feed-title-link">
                <h3 className="feed-movie-title">{movie?.title || post.title}</h3>
              </Link>

              {post.note ? <p className="feed-note">{post.note}</p> : null}

              <div className="feed-post-footer-divider" />

              <footer className="feed-post-footer feed-actions feed-post-footer-inline">
                <div className="feed-post-footer-main">
                  <button type="button" className={`feed-action-btn ${liked ? "liked" : ""}`} onClick={handleLike} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>{likesCount}</span>
                  </button>
                  <button type="button" className="feed-action-btn" onClick={() => setLikesOpen(true)}>
                    See likes
                  </button>
                  <button
                    type="button"
                    className={`feed-action-btn ${commentsOpen ? "active" : ""}`}
                    onClick={toggleComments}
                    disabled={commentsLoading}
                    style={{ display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>{commentsLoading ? "…" : commentsCount}</span>
                  </button>
                </div>
                <div className="feed-post-footer-right">
                    <span className="feed-date">
                      {new Date(post.watchedOn || post.createdAt).toLocaleDateString()}
                    </span>
                    <RatingBadge rating={post.rating} />
                  </div>
              </footer>
            </div>
          </div>
        ) : (
          <>
            <div className="feed-post-body feed-post-body-music">
              <MusicPostExtras
                post={post}
                showTitle
                linkTitle
                showRating
                date={new Date(post.watchedOn || post.createdAt).toLocaleDateString()}
              />
              {post.note ? (
                <div className="feed-review-block" style={{ marginTop: "1rem" }}>
                  <p className="feed-note">{post.note}</p>
                </div>
              ) : null}
            </div>
          </>
        )}

        <AnimatePresence initial={false}>
          {commentsOpen ? (
            <motion.div
              key="comments"
              className="feed-comments"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={commentsTransition}
              style={{ overflow: "hidden" }}
            >
              {isAuthenticated ? (
                <form className="comment-form" onSubmit={submitComment}>
                  <input
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    Post
                  </button>
                </form>
              ) : (
                <p className="sidebar-muted">
                  <Link to="/login">Sign in</Link> to comment.
                </p>
              )}
              {comments.map((c) => (
                <div key={c._id} className="comment-item">
                  <Link to={`/profile/${c.user?.username}`}>
                    <strong>{c.user?.name}</strong>
                  </Link>
                  <p>{c.text}</p>
                </div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.article>

      <LikesModal reviewId={post._id} open={likesOpen} onClose={() => setLikesOpen(false)} />
    </>
  );
}

export default FeedPost;
