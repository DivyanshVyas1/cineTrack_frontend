import { AnimatePresence, motion } from "framer-motion";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import FollowButton from "../social/FollowButton";
import CharacterSection from "./CharacterSection";
import FloatingCharactersCloud from "./FloatingCharactersCloud";
import GenreBreakdown from "./GenreBreakdown";

const formatWatchTime = (minutes) => {
  if (!minutes || isNaN(minutes) || minutes === 0) return "0m";
  const m = Math.floor(minutes);
  const days = Math.floor(m / (24 * 60));
  const hours = Math.floor((m % (24 * 60)) / 60);
  const remainingMinutes = m % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${remainingMinutes}m`;
  return `${remainingMinutes}m`;
};

// Animated stat counter
function StatCell({ value, label, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={onClick ? { scale: 1.04 } : {}}
      whileTap={onClick ? { scale: 0.97 } : {}}
      style={{
        background: "none", border: "none", cursor: onClick ? "pointer" : "default",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "0.85rem 0.5rem", flex: 1,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
      }}
    >
      <motion.strong
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ display: "block", fontSize: "1.4rem", fontWeight: "800", color: "#fff", lineHeight: 1.15, fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </motion.strong>
      <span style={{ display: "block", marginTop: "0.3rem", fontSize: "0.65rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
    </motion.button>
  );
}

function ProfileHero({
  profile,
  stats,
  genreOverall,
  isOwner,
  isFollowing,
  requestPending = false,
  progressData = null,
  tasteMatchPercent = null,
  canViewContent = true,
  followRequestCount = 0,
  requestsOpen = false,
  onToggleFollowRequests,
  onFollowChange,
  onEditProfile,
  onCompareProfile,
  onShowFollowList,
  onOpenAchievements,
  requestsPanel = null,
}) {
  const user = profile;
  const favoriteCharacters = user.favoriteCharacters || [];
  const ganduCharacters = user.ganduCharacters || [];

  const isHeroicGenre = progressData?.genreSpecialist?.count >= 100;
  const isHeroicBook = progressData?.bibliophile?.count >= 100;

  return (
    <section 
      className="glass-card profile-hero" 
      style={{ 
        padding: 0, overflow: "hidden", position: "relative",
        boxShadow: isHeroicGenre ? "0 0 30px rgba(255, 42, 133, 0.4), inset 0 0 15px rgba(120, 80, 255, 0.3)" : undefined,
        border: isHeroicGenre ? "1px solid rgba(255, 42, 133, 0.5)" : undefined,
        transition: "all 0.3s ease"
      }}
    >

      {/* ── Cinematic gradient background ── */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 70% 55% at 0% 0%, rgba(255,42,133,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 100% 0%, rgba(120,80,255,0.07) 0%, transparent 55%),
          radial-gradient(ellipse 40% 35% at 50% 100%, rgba(0,229,255,0.05) 0%, transparent 60%)
        `,
      }} />

      <div style={{ position: "relative", zIndex: 1, padding: "1.25rem 1.25rem 0" }}>
        
        {/* Achievements Trophy Button */}
        <button
          className="mobile-achievements-trophy"
          onClick={onOpenAchievements}
          title="Trophy Cabinet"
          style={{
            position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: "36px", height: "36px",
            alignItems: "center", justifyContent: "center", cursor: "pointer",
            fontSize: "1.1rem", transition: "all 0.2s", zIndex: 10
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "scale(1.05)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "scale(1)"; }}
        >
          🏆
        </button>

        <header className="profile-hero-header" style={{ paddingBottom: "1.25rem" }}>
          
          {/* ── IDENTITY ROW ── */}
          <div className="profile-identity" style={{ alignItems: "center", gap: "1rem", flex: 1, minWidth: 0 }}>

            {/* Avatar with glow ring */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                position: "absolute", inset: "-3px", borderRadius: "1.05rem",
                background: isHeroicGenre 
                  ? "linear-gradient(135deg, #ff2a85, #7850ff, #00e5ff, #ff2a85)" 
                  : "linear-gradient(135deg, rgba(255,42,133,0.5), rgba(120,80,255,0.5), rgba(0,229,255,0.4))",
                filter: "blur(6px)", opacity: 0.7, zIndex: 0,
                animation: isHeroicGenre ? "pulseGlow 3s infinite" : "none"
              }} />
              <div style={{ position: "relative", zIndex: 1, borderRadius: "0.9rem", overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)" }}>
                <Avatar name={user.name} src={user.avatar} size={72} />
              </div>
              
              {/* Top Badges Overlay */}
              {user?.topBadges?.length > 0 && (
                <div style={{ 
                  position: "absolute", top: "-6px", right: "-6px", 
                  display: "flex", gap: "3px", zIndex: 3 
                }}>
                  {user.topBadges.slice(0, 2).map((badge, i) => {
                    const glowSpread = badge.tierName === 'diamond' ? '12px' : badge.tierName === 'gold' ? '8px' : badge.tierName === 'silver' ? '4px' : '0';
                    const shadow = badge.tierName === 'bronze' 
                      ? 'inset 0 0 4px rgba(255,255,255,0.3)' 
                      : badge.tierName === 'heroic'
                      ? `0 0 20px ${badge.glow}, 0 0 30px ${badge.glow}, inset 0 0 6px rgba(255,255,255,0.6)`
                      : `0 0 ${glowSpread} ${badge.glow}, inset 0 0 4px rgba(255,255,255,0.3)`;
                    
                    return (
                      <div
                        key={badge.trackId}
                        title={`${badge.tierName.toUpperCase()} - ${badge.trackId}`}
                        style={{
                          width: "28px", height: "28px",
                          borderRadius: "50%",
                          background: badge.bg,
                          border: `1.5px solid ${badge.border}`,
                          boxShadow: shadow,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.9rem",
                          zIndex: 2 - i,
                          marginLeft: i > 0 ? "-12px" : "0"
                        }}
                      >
                        {badge.icon}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Mystical Book Icon for Heroic Bibliophile */}
              {isHeroicBook && (
                <div title="Heroic Bibliophile" style={{
                  position: "absolute", bottom: "-5px", right: "-5px", zIndex: 2,
                  fontSize: "1.2rem", background: "rgba(0,0,0,0.8)", borderRadius: "50%",
                  padding: "4px", boxShadow: "0 0 15px rgba(255, 215, 0, 0.8)", border: "1px solid rgba(255, 215, 0, 0.5)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  📖
                </div>
              )}
            </div>

            {/* Text info */}
            <div className="profile-hero-text" style={{ flex: 1, minWidth: 0, padding: 0 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.35rem 0.45rem", marginBottom: "0.3rem" }}>
                <h2 style={{ margin: 0, fontSize: "clamp(1.05rem, 4vw, 1.4rem)", fontWeight: "800", lineHeight: 1.2, letterSpacing: "-0.02em", wordBreak: "break-word" }}>
                  {user.name}
                </h2>
                {user.isPrivate ? <Badge variant="amber">Private</Badge> : <Badge variant="green">Public</Badge>}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.35rem", marginBottom: user.bio ? "0.35rem" : 0 }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.82rem", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  @{user.username}
                </span>
                {stats?.totalWatchTime !== undefined ? (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "0.25rem", flexShrink: 0,
                    padding: "0.12rem 0.5rem", borderRadius: "999px",
                    background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)",
                    color: "#38bdf8", fontSize: "0.73rem", fontWeight: "600", whiteSpace: "nowrap",
                  }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    {formatWatchTime(stats.totalWatchTime)} watched
                  </span>
                ) : null}
              </div>

              {user.bio ? (
                <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.83rem", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {user.bio}
                </p>
              ) : null}
            </div>
          </div>

          {/* ── ACTION BUTTONS ── */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", alignItems: "stretch", flex: 1, minWidth: 0, justifyContent: "flex-end" }}>
            {/* BIG TROPHY FOR DESKTOP */}
            <motion.button
              className="desktop-achievements-trophy"
              onClick={onOpenAchievements}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                width: "110px", flexShrink: 0, border: "1px solid rgba(255,215,0,0.3)", borderRadius: "10px", cursor: "pointer",
                background: "linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(205,127,50,0.1) 100%)",
                backdropFilter: "blur(8px)", transition: "border-color 0.2s", margin: 0, padding: "0.6rem 0.4rem"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,215,0,0.6)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,215,0,0.3)"}
            >
              <span style={{ fontSize: "1.6rem", filter: "drop-shadow(0 2px 4px rgba(255,215,0,0.4))", lineHeight: 1 }}>🏆</span>
              <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#ffd700", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>Achievements</span>
            </motion.button>

            <div className="profile-hero-actions" style={{ display: "flex", flexDirection: "column", gap: "0.6rem", flex: "1 1 200px", minWidth: 0, paddingTop: 0 }}>
            {isOwner ? (
              <div style={{ display: "flex", gap: "0.6rem", width: "100%" }}>
                <button
                  type="button"
                  className="btn-ghost edit-profile-btn"
                  onClick={onEditProfile}
                  style={{ flex: 1, height: "40px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", margin: 0, padding: 0 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit profile
                </button>
                <button
                  type="button"
                  className={`btn-ghost edit-profile-btn ${requestsOpen ? "active" : ""}`}
                  onClick={onToggleFollowRequests}
                  style={{ flex: 1, height: "40px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", position: "relative", margin: 0, padding: 0 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                  Requests
                  {followRequestCount > 0 ? (
                    <span className="follow-request-count" style={{ top: "-5px", right: "-5px" }}>{followRequestCount}</span>
                  ) : null}
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", width: "100%" }}>
                {/* Follow + Taste Match row */}
                <div style={{ display: "flex", gap: "0.6rem", width: "100%" }}>
                  <div style={{ flex: 1 }}>
                    <FollowButton
                      username={user.username}
                      initialFollowing={isFollowing}
                      initialRequestPending={requestPending}
                      isPrivateTarget={user.isPrivate}
                      onChange={onFollowChange}
                      style={{ width: "100%", height: "40px", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", whiteSpace: "nowrap" }}
                    />
                  </div>
                  {tasteMatchPercent != null ? (
                    <span className="taste-match-hero-pill" style={{ flex: 1, height: "40px", padding: "0 0.5rem", display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", gap: "0.4rem", margin: 0, boxSizing: "border-box" }}>
                      {tasteMatchPercent}% Taste Match
                    </span>
                  ) : null}
                </div>

                {/* Compare button — underneath */}
                {tasteMatchPercent != null ? (
                  <motion.button
                    type="button"
                    onClick={onCompareProfile}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: "100%", height: "40px", border: "none", borderRadius: "10px", cursor: "pointer",
                      background: "linear-gradient(135deg, rgba(255,42,133,0.15) 0%, rgba(120,80,255,0.15) 50%, rgba(0,229,255,0.15) 100%)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff", fontSize: "0.9rem", fontWeight: "700", letterSpacing: "0.02em",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                      backdropFilter: "blur(8px)",
                      transition: "border-color 0.2s",
                      margin: 0
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,42,133,0.4)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
                    </svg>
                    Compare Taste
                  </motion.button>
                ) : null}
              </div>
            )}
          </div>
          </div>
        </header>
      </div>

      {/* ── FOLLOW REQUESTS PANEL ── */}
      <AnimatePresence initial={false}>
        {isOwner && requestsOpen ? (
          <motion.section
            className="profile-block profile-requests-block"
            aria-label="Follow requests"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden", position: "relative", zIndex: 1 }}
          >
            <h4 className="profile-requests-title">Pending follow requests</h4>
            {requestsPanel}
          </motion.section>
        ) : null}
      </AnimatePresence>

      {/* ── STATS BAR ── */}
      {stats ? (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.2)",
          position: "relative", zIndex: 1,
        }}>
          <StatCell value={stats.followersCount ?? 0} label="Followers" onClick={() => onShowFollowList?.("followers")} />
          <StatCell value={stats.followingCount ?? 0} label="Following" onClick={() => onShowFollowList?.("following")} />
          <div style={{ borderRight: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0.85rem 0.5rem" }}>
            <strong style={{ display: "block", fontSize: "1.4rem", fontWeight: "800", color: "#fff", lineHeight: 1.15 }}>{stats.postsCount ?? 0}</strong>
            <span style={{ display: "block", marginTop: "0.3rem", fontSize: "0.65rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Posts</span>
          </div>
        </div>
      ) : null}

      {/* ── GENRE + CHARACTERS ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "flex-start", padding: "1.5rem", position: "relative", zIndex: 1 }}>
        {genreOverall?.length ? (
          <div style={{ flex: "1 1 0%", minWidth: "280px" }}>
            <section className="profile-block profile-genre-block" aria-label="Genre taste" style={{ margin: 0 }}>
              <GenreBreakdown
                stats={genreOverall}
                title="Overall genre taste"
                subtitle={canViewContent ? "All logged titles" : "Genre breakdown only — follow to see posts"}
                embedded
              />
            </section>
          </div>
        ) : null}

        {(favoriteCharacters.length > 0 || ganduCharacters.length > 0) ? (
          <div style={{ flex: "1 1 0%", minWidth: "280px", display: "flex" }}>
            <FloatingCharactersCloud
              characters={[
                ...favoriteCharacters.map(c => ({ ...c, variant: "favorite" })),
                ...ganduCharacters.map(c => ({ ...c, variant: "gandu" }))
              ]}
            />
          </div>
        ) : null}
      </div>

    </section>
  );
}

export default ProfileHero;
