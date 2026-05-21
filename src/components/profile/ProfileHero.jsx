import { AnimatePresence, motion } from "framer-motion";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import FollowButton from "../social/FollowButton";
import CharacterSection from "./CharacterSection";
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
          <div className="profile-identity">
            <Avatar name={user.name} src={user.avatar} size={80} />
            <div className="profile-hero-text">
              <div className="profile-title-row">
                <h2>{user.name}</h2>
                {isOwner ? <Badge variant="pink">You</Badge> : null}
                {user.isPrivate ? (
                  <Badge variant="amber">Private</Badge>
                ) : (
                  <Badge variant="green">Public</Badge>
                )}
              </div>
              <p className="profile-handle">@{user.username}</p>
              {user.bio ? <p className="profile-bio">{user.bio}</p> : null}
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
              <FollowButton
                username={user.username}
                initialFollowing={isFollowing}
                initialRequestPending={requestPending}
                isPrivateTarget={user.isPrivate}
                onChange={onFollowChange}
              />
            ) : null}
            {!isOwner && tasteMatchPercent != null ? (
              <span className="taste-match-hero-pill">{tasteMatchPercent}% taste match</span>
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
              <div
                className="profile-stat-cell profile-stat-rating"
                title="Average score other users gave this profile"
              >
                <strong>{stats.averageRating != null ? `${stats.averageRating}/10` : "—"}</strong>
                <span>Avg rating</span>
                {stats.ratingsCount > 0 ? (
                  <em>{stats.ratingsCount} reviews</em>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {genreOverall?.length ? (
          <section className="profile-block profile-genre-block" aria-label="Genre taste">
            <GenreBreakdown
              stats={genreOverall}
              title="Overall genre taste"
              subtitle={canViewContent ? "All logged titles" : "Genre breakdown only — follow to see posts"}
              embedded
            />
          </section>
        ) : null}

        <CharacterSection label="Favorite characters" characters={favoriteCharacters} variant="favorite" />
        <CharacterSection
          label="Pure gaandu characters"
          characters={ganduCharacters}
          variant="gandu"
        />
      </div>
    </section>
  );
}

export default ProfileHero;
