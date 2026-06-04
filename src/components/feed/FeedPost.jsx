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

const commentsTransition = { duration: 0.28, ease: [0.4, 0, 0.2, 1] };

function FeedPost({ post, onChanged }) {
  const { isAuthenticated } = useAuth();
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
        className={`glass-card feed-card feed-post ${post.isFollowing ? "feed-post-following" : ""}`}
      >
        <header className="feed-post-header">
          <Link to={`/profile/${author?.username}`} className="feed-author">
            <Avatar name={author?.name} src={author?.avatar} size={36} />
            <div>
              <strong>{author?.name}</strong>
              <span>@{author?.username}</span>
            </div>
          </Link>
          <div className="feed-header-actions">
            {!post.isOwnPost ? (
              <FollowButton username={author?.username} initialFollowing={post.isFollowing} compact />
            ) : null}
            {post.isOwnPost ? (
              <PostOwnerToolbar post={post} onChanged={onChanged} menuOnly />
            ) : null}
          </div>
        </header>

        {!isMusic ? (
          <div className="feed-post-main-layout">
            <Link to={buildTitleLink(post)} className="feed-post-poster-link">
              {(movie?.poster || movie?.backdrop) ? (
                <img src={movie.poster || movie.backdrop} alt={movie?.title || post.title} className="feed-post-poster" />
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
                  <span className="feed-post-genres">
                    {movie.genres.slice(0, 3).join(" • ")}
                  </span>
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
                  <PostRatingBadge rating={post.rating} />
                </div>
              </footer>
            </div>
          </div>
        ) : (
          <>
            <div className="feed-post-body feed-post-body-music">
              <MusicPostExtras post={post} showTitle linkTitle showRating />
              {post.note ? (
                <div className="feed-review-block" style={{ marginTop: "1rem" }}>
                  <p className="feed-note">{post.note}</p>
                </div>
              ) : null}
            </div>

            <footer className="feed-post-footer feed-actions">
              <div className="feed-post-footer-main">
                <span className="feed-date">
                  {new Date(post.watchedOn || post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </footer>
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
