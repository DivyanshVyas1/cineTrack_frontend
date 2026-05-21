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
            {post.isFollowing ? <span className="following-pill">Following</span> : null}
            {!post.isOwnPost ? (
              <FollowButton username={author?.username} initialFollowing={post.isFollowing} compact />
            ) : null}
            {post.isOwnPost ? (
              <PostOwnerToolbar post={post} onChanged={onChanged} menuOnly />
            ) : null}
          </div>
        </header>

        {!isMusic && (movie?.backdrop || movie?.poster) ? (
          <div
            className="feed-post-backdrop"
            style={{ backgroundImage: `url(${movie.backdrop || movie.poster})` }}
          />
        ) : null}
        {!isMusic && !(movie?.backdrop || movie?.poster) ? (
          <div className="feed-post-backdrop feed-post-backdrop-fallback" />
        ) : null}

        <div className={`feed-post-body ${isMusic ? "feed-post-body-music" : ""}`}>
          {isMusic ? (
            <MusicPostExtras post={post} showTitle linkTitle />
          ) : (
            <>
              <div className="feed-title-row">
                <Link to={buildTitleLink(post)} className="feed-title-link">
                  <h3 className="feed-movie-title">{movie?.title || post.title}</h3>
                </Link>
              </div>
              {post.isSpoiler ? <Badge variant="amber">Spoiler</Badge> : null}
            </>
          )}
          {post.note ? (
            <div className={isMusic ? "feed-review-block" : undefined}>
              <p className="feed-note">{post.note}</p>
            </div>
          ) : null}
        </div>

        <footer className="feed-post-footer feed-actions">
          <div className="feed-post-footer-main">
            <button type="button" className={`feed-action-btn ${liked ? "liked" : ""}`} onClick={handleLike}>
              ♥ {likesCount}
            </button>
            <button type="button" className="feed-action-btn" onClick={() => setLikesOpen(true)}>
              See likes
            </button>
            <button
              type="button"
              className={`feed-action-btn ${commentsOpen ? "active" : ""}`}
              onClick={toggleComments}
              disabled={commentsLoading}
            >
              {commentsLoading ? "…" : "💬"} {commentsCount}
            </button>
            <span className="feed-date">
              {new Date(post.watchedOn || post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <PostRatingBadge rating={post.rating} />
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
      </motion.article>

      <LikesModal reviewId={post._id} open={likesOpen} onClose={() => setLikesOpen(false)} />
    </>
  );
}

export default FeedPost;
