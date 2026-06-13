import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PostOwnerToolbar from "../post/PostOwnerToolbar";
import { buildTitleLink } from "../../lib/titleLink";

function StarRating({ rating }) {
  const r = parseFloat(rating) || 0;
  const filled = Math.round(r / 2); // out of 5
  return (
    <span style={{ display: "inline-flex", gap: "1px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i < filled ? "#fbbf24" : "rgba(255,255,255,0.2)"} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

function PostCard({ post, canEdit, onChanged, isWatchlist = false }) {
  const [hovered, setHovered] = useState(false);
  const title = post.title || post.movie?.title;
  const poster = post.poster || post.movie?.poster;
  const rating = post.rating;
  const year = post.year || post.movie?.year;
  const type = post.type || post.movie?.type;

  const ratingColor =
    rating >= 8.5 ? "#4ade80" :
    rating >= 7   ? "#fbbf24" :
    rating >= 5   ? "#fb923c" :
                    "#f87171";

  return (
    <motion.article
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        position: "relative",
        borderRadius: "10px",
        overflow: "hidden",
        aspectRatio: "2/3",
        display: "block",
        cursor: "pointer",
        boxShadow: hovered
          ? "0 16px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)"
          : "0 4px 16px rgba(0,0,0,0.4)",
        transition: "box-shadow 0.2s ease",
      }}
    >
      <Link to={buildTitleLink(post.movie || post)} style={{ display: "block", width: "100%", height: "100%" }}>
        {/* Poster image */}
        {poster ? (
          <img
            src={poster}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.35s ease",
              transform: hovered ? "scale(1.06)" : "scale(1)",
            }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(135deg, #1a1a2e, #16213e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text-secondary)", textAlign: "center", padding: "1rem",
            boxSizing: "border-box", fontSize: "0.85rem", fontWeight: "600",
          }}>
            {title}
          </div>
        )}

        {/* Always-visible rating badge */}
        {!isWatchlist && rating != null && (
          <div style={{
            position: "absolute", top: "8px", left: "8px",
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            border: `1px solid ${ratingColor}44`,
            color: ratingColor,
            padding: "3px 7px",
            borderRadius: "6px",
            fontSize: "0.78rem",
            fontWeight: "800",
            display: "flex", alignItems: "center", gap: "3px",
            letterSpacing: "0.02em",
          }}>
            <span style={{ fontSize: "0.7rem" }}>★</span>
            {rating.toFixed(1)}
          </div>
        )}

        {/* Hover overlay with title + meta */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.2) 70%, transparent 100%)",
                display: "flex", flexDirection: "column", justifyContent: "flex-end",
                padding: "10px 10px 12px",
              }}
            >
              <div style={{
                fontSize: "0.72rem",
                fontWeight: "800",
                color: "#fff",
                lineHeight: 1.3,
                marginBottom: "4px",
                textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                wordBreak: "break-word",
              }}>
                {title}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }}>
                {!isWatchlist && rating != null && <StarRating rating={rating} />}
                {year && (
                  <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.45)", marginLeft: "auto", flexShrink: 0 }}>
                    {year}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      {/* Edit toolbar */}
      {canEdit && (
        <div style={{
          position: "absolute", top: "6px", right: "6px",
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(6px)",
          borderRadius: "6px", padding: "2px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <PostOwnerToolbar post={post} onChanged={onChanged} menuOnly />
        </div>
      )}
    </motion.article>
  );
}

export default PostCard;
