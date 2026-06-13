import { Link } from "react-router-dom";
import { buildTitleLink } from "../../lib/titleLink";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FollowButton from "../social/FollowButton";
import Avatar from "../ui/Avatar";
import { getGenreColor } from "../../lib/colors";

function RatingBadge({ rating }) {
  if (rating == null) return null;
  const r = parseFloat(rating);
  const color =
    r >= 8.5 ? "#4ade80" :
    r >= 7   ? "#fbbf24" :
    r >= 5   ? "#fb923c" :
               "#f87171";
  return (
    <div style={{
      position: "absolute", top: "8px", left: "8px", zIndex: 2,
      display: "flex", alignItems: "center", gap: "3px",
      padding: "3px 8px", borderRadius: "6px",
      background: "rgba(0,0,0,0.75)",
      border: `1px solid ${color}55`,
      color, fontSize: "0.82rem", fontWeight: "800",
      backdropFilter: "blur(6px)",
      letterSpacing: "0.02em",
    }}>
      <span style={{ fontSize: "0.72rem" }}>★</span>
      {r.toFixed(1)}
    </div>
  );
}

function PosterCard({ post }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={{ scrollSnapAlign: "start", position: "relative", borderRadius: "10px", overflow: "hidden", minWidth: 0 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <Link
        to={buildTitleLink(post)}
        style={{ display: "block", width: "100%", textDecoration: "none", position: "relative" }}
      >
        <img
          src={post.poster}
          alt={post.title}
          style={{
            width: "100%", aspectRatio: "2/3", objectFit: "cover",
            display: "block", backgroundColor: "var(--bg)",
            transition: "transform 0.35s ease",
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
        />

        {/* Always-visible bottom gradient + title */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 65%)",
          display: "flex", alignItems: "flex-end",
          padding: "8px",
          pointerEvents: "none",
        }}>
          <span style={{
            fontSize: "0.68rem", fontWeight: "800", color: "#fff",
            lineHeight: 1.3, wordBreak: "break-word",
            textShadow: "0 1px 4px rgba(0,0,0,0.9)",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {post.title}
          </span>
        </div>

        <RatingBadge rating={post.rating} />
      </Link>
    </motion.div>
  );
}

function UserFeedCard({ feedGroup }) {
  const { _id, user, subtitle, posts, isFollowing, isOwnProfile, communityRating, topGenres } = feedGroup;

  const displayPosts = [...posts];
  while (displayPosts.length < 3) displayPosts.push(null);

  const hasMoreThanThree = posts.length > 3;
  const sliderRef = useRef(null);
  const [showRightGradient, setShowRightGradient] = useState(hasMoreThanThree);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setShowRightGradient(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    if (hasMoreThanThree) handleScroll();
  }, [hasMoreThanThree]);

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: sliderRef.current.clientWidth * 0.75, behavior: "smooth" });
  };

  const commRating = communityRating != null ? parseFloat(communityRating) : null;
  const ratingColor =
    commRating >= 8.5 ? "#4ade80" :
    commRating >= 7   ? "#fbbf24" :
    commRating >= 5   ? "#fb923c" :
                        "#f87171";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass-card"
      style={{ padding: "1.35rem", display: "flex", flexDirection: "column", gap: "1rem", minWidth: 0, overflow: "hidden" }}
    >
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
        <Link to={`/profile/${user.username}`} style={{ flexShrink: 0, textDecoration: "none", position: "relative" }}>
          <div style={{
            position: "absolute", inset: "-2px", borderRadius: "0.8rem",
            background: "linear-gradient(135deg, rgba(255,42,133,0.2), rgba(120,80,255,0.2))",
            filter: "blur(4px)", zIndex: 0,
          }} />
          <div style={{ position: "relative", zIndex: 1, borderRadius: "0.7rem", overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.08)" }}>
            <Avatar name={user.name} src={user.avatar} size={52} />
          </div>
          
          {/* Top Badges Overlay */}
          {user?.topBadges?.length > 0 && (
            <div style={{ 
              position: "absolute", top: "-4px", right: "-4px", 
              display: "flex", gap: "2px", zIndex: 2 
            }}>
              {user.topBadges.slice(0, 2).map((badge, i) => {
                const glowSpread = badge.tierName === 'diamond' ? '9px' : badge.tierName === 'gold' ? '6px' : badge.tierName === 'silver' ? '3px' : '0';
                const shadow = badge.tierName === 'bronze' 
                  ? 'inset 0 0 3px rgba(255,255,255,0.3)' 
                  : badge.tierName === 'heroic'
                  ? `0 0 15px ${badge.glow}, 0 0 25px ${badge.glow}, inset 0 0 5px rgba(255,255,255,0.6)`
                  : `0 0 ${glowSpread} ${badge.glow}, inset 0 0 3px rgba(255,255,255,0.3)`;
                
                return (
                  <div
                    key={badge.trackId}
                    title={`${badge.tierName.toUpperCase()} - ${badge.trackId}`}
                    style={{
                      width: "20px", height: "20px",
                      borderRadius: "50%",
                      background: badge.bg,
                      border: `1px solid ${badge.border}`,
                      boxShadow: shadow,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.65rem",
                      zIndex: 2 - i,
                      marginLeft: i > 0 ? "-8px" : "0"
                    }}
                  >
                    {badge.icon}
                  </div>
                );
              })}
            </div>
          )}
        </Link>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.3rem" }}>
            <Link to={`/profile/${user.username}`} style={{ textDecoration: "none", minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#fff", letterSpacing: "-0.01em" }}>
                {user.name}
              </h3>
            </Link>
            {!isOwnProfile && (
              <div style={{ flexShrink: 0, transform: "scale(0.88)", transformOrigin: "right center" }}>
                <FollowButton username={user.username} initialFollowing={isFollowing} isPrivateTarget={user.isPrivate} compact />
              </div>
            )}
          </div>

          {topGenres?.length > 0 && (
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "nowrap", overflowX: "auto", scrollbarWidth: "none" }}>
              {topGenres.map(g => {
                const colors = getGenreColor(g);
                return (
                  <span key={g} style={{ flexShrink: 0, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "1px 8px", fontSize: "0.68rem", color: colors.color, background: colors.bg, whiteSpace: "nowrap" }}>
                    {g}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Subtitle ── */}
      {subtitle && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.9rem" }}>🎬</span>
          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", letterSpacing: "0.01em" }}>
            {subtitle}
          </span>
        </div>
      )}

      {/* ── Poster Slider ── */}
      <div style={{ position: "relative", minWidth: 0, width: "100%" }}>
        <div
          ref={sliderRef}
          onScroll={hasMoreThanThree ? handleScroll : undefined}
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "calc(33.333% - 0.5rem)",
            gap: "0.75rem",
            overflowX: "auto",
            paddingBottom: "2px",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
          }}
        >
          {displayPosts.map((post, index) => {
            if (!post) return <div key={`empty-${index}`} />;
            return <PosterCard key={post._id} post={post} />;
          })}
        </div>

        {hasMoreThanThree && showRightGradient && (
          <div style={{
            position: "absolute", top: 0, right: 0, bottom: "2px",
            width: "30%",
            background: "linear-gradient(to right, transparent, rgba(5,8,15,0.95))",
            display: "flex", alignItems: "center", justifyContent: "flex-end",
            paddingRight: "10px", zIndex: 10, pointerEvents: "none",
          }}>
            <div
              onClick={scrollRight}
              style={{
                width: "34px", height: "34px", borderRadius: "50%",
                background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", backdropFilter: "blur(6px)",
                cursor: "pointer", pointerEvents: "auto",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.25rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {commRating != null ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: "600" }}>
              Community Rating
            </span>
            <strong style={{ fontSize: "1.1rem", color: ratingColor, fontWeight: "800", letterSpacing: "-0.01em" }}>
              {commRating.toFixed(1)} <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", fontWeight: "400" }}>/10</span>
            </strong>
          </div>
        ) : <div />}

        <Link
          to={`/profile/${user.username}`}
          style={{
            textDecoration: "none",
            padding: "0.4rem 1rem",
            borderRadius: "8px",
            background: "linear-gradient(135deg, rgba(255,42,133,0.15), rgba(120,80,255,0.15))",
            border: "1px solid rgba(255,42,133,0.25)",
            color: "#fff",
            fontSize: "0.8rem",
            fontWeight: "700",
            letterSpacing: "0.01em",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,42,133,0.5)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,42,133,0.25)"}
        >
          View Profile →
        </Link>
      </div>
    </motion.div>
  );
}

export default UserFeedCard;
