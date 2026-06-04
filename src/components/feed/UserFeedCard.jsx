import { Link } from "react-router-dom";
import { buildTitleLink } from "../../lib/titleLink";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import FollowButton from "../social/FollowButton";
import Avatar from "../ui/Avatar";

function UserFeedCard({ feedGroup }) {
  const { _id, user, subtitle, posts, isFollowing, isOwnProfile, communityRating, topGenres } = feedGroup;
  
  // Pad posts to exactly 4 slots to maintain grid structure if <= 4
  const displayPosts = [...posts];
  while (displayPosts.length < 4) {
    displayPosts.push(null);
  }

  const hasMoreThanFour = posts.length > 4;
  const sliderRef = useRef(null);
  const [showRightGradient, setShowRightGradient] = useState(hasMoreThanFour);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setShowRightGradient(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    if (hasMoreThanFour) {
      handleScroll();
    }
  }, [hasMoreThanFour]);

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: sliderRef.current.clientWidth * 0.75, behavior: "smooth" });
    }
  };

  return (
    <div className="glass-card panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
        <Link to={`/profile/${user.username}`} style={{ flexShrink: 0, textDecoration: "none" }}>
          <Avatar name={user.name} src={user.avatar} size={64} />
        </Link>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", paddingTop: "0.2rem", flex: 1, minWidth: 0 }}>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
            <Link to={`/profile/${user.username}`} style={{ textDecoration: "none", color: "var(--text-h)", overflow: "hidden" }}>
              <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</h3>
            </Link>
            
            {!isOwnProfile && (
              <div style={{ flexShrink: 0, transform: "scale(0.9)", transformOrigin: "right center" }}>
                <FollowButton 
                  username={user.username} 
                  initialFollowing={isFollowing} 
                  isPrivateTarget={user.isPrivate} 
                  compact 
                />
              </div>
            )}
          </div>
          
          {topGenres?.length > 0 && (
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "nowrap", overflowX: "auto", paddingBottom: "2px", scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {topGenres.map(g => (
                <span key={g} style={{ flexShrink: 0, border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "1px 8px", fontSize: "0.7rem", color: "var(--text-secondary)", background: "rgba(255,255,255,0.05)", whiteSpace: "nowrap" }}>
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="sidebar-muted" style={{ margin: "0.5rem 0 0 0", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
         🎬 {subtitle}
      </p>

      <div style={{ position: "relative" }}>
        <div 
          ref={sliderRef}
          onScroll={hasMoreThanFour ? handleScroll : undefined}
          style={{ 
            display: "grid", 
            gridAutoFlow: "column",
            gridAutoColumns: "calc(25% - 0.75rem)",
            gap: "1rem", 
            overflowX: "auto", 
            paddingBottom: "0.5rem",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none", /* Firefox */
          }}
        >
          {displayPosts.map((post, index) => {
            if (!post) return <div key={`empty-${index}`} />;
            
            return (
              <Link 
                to={buildTitleLink(post)} 
                key={post._id} 
                style={{ 
                  scrollSnapAlign: "start",
                  position: "relative", 
                  borderRadius: "8px", 
                  overflow: "hidden", 
                  textDecoration: "none", 
                  display: "block" 
                }}
              >
                <div style={{ position: "absolute", bottom: "8px", left: "8px", background: "rgba(0,0,0,0.8)", color: "white", padding: "4px 8px", borderRadius: "6px", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", zIndex: 2 }}>
                  <span style={{ color: "#ffb400" }}>★</span> {post.rating ? post.rating.toFixed(1) : "0.0"}
                </div>
                <img 
                  src={post.poster} 
                  alt={post.title} 
                  style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", display: "block", backgroundColor: "var(--bg)" }} 
                />
              </Link>
            );
          })}
        </div>
        
        {hasMoreThanFour && showRightGradient && (
          <div 
            style={{ 
              position: "absolute", 
              top: 0, 
              right: 0, 
              bottom: "0.5rem", 
              width: "25%", 
              background: "linear-gradient(to right, transparent, rgba(5, 8, 15, 0.95))", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "flex-end",
              paddingRight: "10px",
              zIndex: 10,
              pointerEvents: "none"
            }}
          >
            <div 
              onClick={scrollRight}
              style={{ 
                width: "36px", 
                height: "36px", 
                borderRadius: "50%", 
                background: "rgba(255,255,255,0.15)", 
                border: "1px solid rgba(255,255,255,0.3)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                color: "white", 
                backdropFilter: "blur(4px)",
                cursor: "pointer",
                pointerEvents: "auto"
              }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.5rem" }}>
        <div>
          {communityRating != null && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Community Rating</span>
              <strong style={{ fontSize: "1.2rem", color: "var(--text-h)" }}>{communityRating}/10</strong>
            </div>
          )}
        </div>
        <Link to={`/profile/${user.username}`} className="btn-primary" style={{ textDecoration: "none" }}>
          View Full Profile &gt;
        </Link>
      </div>
    </div>
  );
}

export default UserFeedCard;
