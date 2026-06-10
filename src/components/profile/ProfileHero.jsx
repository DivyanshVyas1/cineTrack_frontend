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
  tasteMatchPercent = null,
  canViewContent = true,
  followRequestCount = 0,
  requestsOpen = false,
  onToggleFollowRequests,
  onFollowChange,
  onEditProfile,
  onCompareProfile,
  onShowFollowList,
  requestsPanel = null,
}) {
  const user = profile;
  const favoriteCharacters = user.favoriteCharacters || [];
  const ganduCharacters = user.ganduCharacters || [];

  return (
    <section className="glass-card profile-hero" style={{ padding: 0, overflow: "hidden", position: "relative" }}>

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
        <header className="profile-hero-header" style={{ alignItems: "center", paddingBottom: "1.25rem" }}>
          
          {/* ── IDENTITY ROW ── */}
          <div className="profile-identity" style={{ alignItems: "center", gap: "1rem", flex: 1, minWidth: 0 }}>

            {/* Avatar with glow ring */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                position: "absolute", inset: "-3px", borderRadius: "1.05rem",
                background: "linear-gradient(135deg, rgba(255,42,133,0.5), rgba(120,80,255,0.5), rgba(0,229,255,0.4))",
                filter: "blur(6px)", opacity: 0.7, zIndex: 0,
              }} />
              <div style={{ position: "relative", zIndex: 1, borderRadius: "0.9rem", overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)" }}>
                <Avatar name={user.name} src={user.avatar} size={72} />
              </div>
            </div>

            {/* Text info */}
            <div className="profile-hero-text" style={{ flex: 1, minWidth: 0, padding: 0 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.35rem 0.45rem", marginBottom: "0.3rem" }}>
                <h2 style={{ margin: 0, fontSize: "clamp(1.05rem, 4vw, 1.4rem)", fontWeight: "800", lineHeight: 1.2, letterSpacing: "-0.02em", wordBreak: "break-word" }}>
                  {user.name}
                </h2>
                {isOwner ? <Badge variant="pink">You</Badge> : null}
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
          <div className="profile-hero-actions" style={{ flexDirection: "column", gap: "0.6rem", minWidth: "260px", flexShrink: 0, paddingTop: 0 }}>
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
                    <span className="taste-match-hero-pill" style={{ flex: 1, height: "40px", padding: "0 0.5rem", display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0, whiteSpace: "nowrap", gap: "0.3rem", margin: 0 }}>
                      <span>✨</span>{tasteMatchPercent}% Taste Match
                    </span>
                  ) : null}
                </div>

                {/* Compare button — full width underneath */}
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
