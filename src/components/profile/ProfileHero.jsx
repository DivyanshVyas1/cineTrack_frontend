import { AnimatePresence, motion } from "framer-motion";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import FollowButton from "../social/FollowButton";
import CharacterSection from "./CharacterSection";
import FloatingCharactersCloud from "./FloatingCharactersCloud";
import GenreBreakdown from "./GenreBreakdown";

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
  onShowFollowList,
  requestsPanel = null,
}) {
  const user = profile;
  const favoriteCharacters = user.favoriteCharacters || [];
  const ganduCharacters = user.ganduCharacters || [];

  return (
    <section className="glass-card profile-hero">
      <div className="profile-hero-bg" aria-hidden="true" />

      <div className="profile-hero-inner">
        <header className="profile-hero-header">
          <div className="profile-identity" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "1rem", textAlign: "left", flexWrap: "nowrap" }}>
            <Avatar name={user.name} src={user.avatar} size={80} />
            <div className="profile-hero-text" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flex: 1, minWidth: 0 }}>
              <div className="profile-title-row" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-start", gap: "0.5rem" }}>
                <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>{user.name}</h2>
                {isOwner ? <Badge variant="pink">You</Badge> : null}
                {user.isPrivate ? (
                  <Badge variant="amber">Private</Badge>
                ) : (
                  <Badge variant="green">Public</Badge>
                )}
              </div>
              <p className="profile-handle" style={{ margin: "0.2rem 0 0 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>@{user.username}</p>
              {user.bio ? <p className="profile-bio" style={{ margin: "0.5rem 0 0 0" }}>{user.bio}</p> : null}
            </div>
          </div>

          <div className="profile-hero-actions">
            {isOwner ? (
              <div className="profile-owner-actions">
                <button type="button" className="btn-ghost edit-profile-btn" onClick={onEditProfile}>
                  Edit profile
                </button>
                <button
                  type="button"
                  className={`btn-ghost edit-profile-btn ${requestsOpen ? "active" : ""}`}
                  onClick={onToggleFollowRequests}
                >
                  Follow requests
                  {followRequestCount > 0 ? (
                    <span className="follow-request-count">{followRequestCount}</span>
                  ) : null}
                </button>
              </div>
            ) : null}
            {!isOwner ? (
              <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
                <div style={{ flex: 1, display: "flex" }}>
                  <FollowButton
                    username={user.username}
                    initialFollowing={isFollowing}
                    initialRequestPending={requestPending}
                    isPrivateTarget={user.isPrivate}
                    onChange={onFollowChange}
                    style={{ width: "100%", height: "42px", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", whiteSpace: "nowrap" }}
                  />
                </div>
                {tasteMatchPercent != null ? (
                  <div style={{ flex: 1, display: "flex" }}>
                    <span className="taste-match-hero-pill" style={{ width: "100%", height: "42px", display: "flex", alignItems: "center", justifyContent: "center", margin: 0, boxSizing: "border-box", whiteSpace: "nowrap" }}>
                      {tasteMatchPercent}% taste match
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </header>

        <AnimatePresence initial={false}>
          {isOwner && requestsOpen ? (
            <motion.section
              className="profile-block profile-requests-block"
              aria-label="Follow requests"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: "hidden" }}
            >
              <h4 className="profile-requests-title">Pending follow requests</h4>
              {requestsPanel}
            </motion.section>
          ) : null}
        </AnimatePresence>

        {stats ? (
          <section className="profile-block profile-stats-block" aria-label="Profile stats">
            <div className="profile-stats-bar">
              <button
                type="button"
                className="profile-stat-cell profile-stat-btn"
                onClick={() => onShowFollowList?.("followers")}
              >
                <strong>{stats.followersCount ?? 0}</strong>
                <span>Followers</span>
              </button>
              <button
                type="button"
                className="profile-stat-cell profile-stat-btn"
                onClick={() => onShowFollowList?.("following")}
              >
                <strong>{stats.followingCount ?? 0}</strong>
                <span>Following</span>
              </button>
              <div className="profile-stat-cell">
                <strong>{stats.postsCount ?? 0}</strong>
                <span>Posts</span>
              </div>
            </div>
          </section>
        ) : null}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "flex-start", marginTop: "1.5rem" }}>
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
      </div>
    </section>
  );
}

export default ProfileHero;
