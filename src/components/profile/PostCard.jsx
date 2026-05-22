import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import PostOwnerToolbar from "../post/PostOwnerToolbar";
import MusicPostExtras from "../post/MusicPostExtras";
import Badge from "../ui/Badge";
import PostRatingBadge from "../post/PostRatingBadge";
import LikesModal from "../social/LikesModal";
import { toggleLike, fetchComments, postComment } from "../../services/socialService";
import { buildTitleLink } from "../../lib/titleLink";

const commentsTransition = { duration: 0.28, ease: [0.4, 0, 0.2, 1] };

function PostCard({ post, canEdit, onChanged, hideActions = false, isWatchlist = false }) {
  const title = post.title || post.movie?.title;
  const poster = post.poster || post.movie?.poster;
  const genres = post.genres?.length ? post.genres : (post.movie?.genres || []);
  const isMusic = post.type === "music" || post.movie?.type === "music";
  const completedOn = post.createdAt;

  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [likesOpen, setLikesOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info("Sign in to like posts");
      return;
    }
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    try {
      const result = await toggleLike(post._id);
      setLiked(result.liked);
      setLikesCount(result.likesCount);
    } catch (err) {
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
      <article className="glass-card profile-post-card">
        {canEdit ? (
          <div className="profile-post-menu-corner">
            <PostOwnerToolbar post={post} onChanged={onChanged} menuOnly />
          </div>
        ) : null}
        {isMusic ? (
          <div className="profile-post-music-wrap" style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: canEdit ? "1.5rem" : "0" }}>
            <MusicPostExtras post={post} showTitle variant="profile" linkTitle />
            {post.note ? <p className="profile-post-note" style={{ margin: 0 }}>{post.note}</p> : null}
          </div>
        ) : (
          <div className="profile-post-layout">
            <Link to={buildTitleLink(post.movie || post)} className="profile-post-poster-link">
              {poster ? (
                <img src={poster} alt={title} className="profile-post-poster" />
              ) : (
                <div className="profile-post-poster profile-post-poster-fallback">No image</div>
              )}
            </Link>
            <div className="profile-post-details">
              <div className="profile-post-top">
                <Link to={buildTitleLink(post.movie || post)}>
                  <h4>{title}</h4>
                </Link>
              </div>
              {genres.length > 0 ? (
                <div className="profile-post-genres">
                  {genres.map((g) => (
                    <span key={g} className="genre-tag">
                      {g}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="sidebar-muted">No genres listed</p>
              )}
              {post.note ? <p className="profile-post-note">{post.note}</p> : null}
              {post.isSpoiler ? <Badge variant="amber">Spoiler</Badge> : null}
              {post.visibility === "private" ? <Badge variant="amber">Private</Badge> : null}
              <div className="profile-post-footer-row">
                {!isWatchlist && (
                  <time className="profile-post-date">
                    Completed on {new Date(completedOn).toLocaleDateString()}
                  </time>
                )}
                <PostRatingBadge rating={post.rating} />
              </div>
            </div>
          </div>
        )}

        {!hideActions ? (
          <>
            <footer
              className="feed-post-footer feed-actions"
              style={{
                marginTop: "1rem",
                ...(isMusic ? { borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.75rem" } : {}),
              }}
            >
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
                {isMusic && post.visibility === "private" ? <Badge variant="amber">Private</Badge> : null}
              </div>
              {isMusic ? <PostRatingBadge rating={post.rating} /> : null}
            </footer>

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
          </>
        ) : null}
      </article>

      <LikesModal reviewId={post._id} open={likesOpen} onClose={() => setLikesOpen(false)} />
    </>
  );
}

export default PostCard;
