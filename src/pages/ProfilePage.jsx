import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ProfileHero from "../components/profile/ProfileHero";
import ProfileTasteSection from "../components/profile/ProfileTasteSection";
import ProfileRequestsPanel from "../components/profile/ProfileRequestsPanel";
import EditProfileModal from "../components/profile/EditProfileModal";
import CompareModal from "../components/profile/CompareModal";
import AchievementsModal from "../components/profile/AchievementsModal";
import FollowListModal from "../components/social/FollowListModal";
import ProfileSectionContent from "../components/profile/ProfileSectionContent";
import ProfileTabNav from "../components/profile/ProfileTabNav";
import { useAuth } from "../hooks/useAuth";
import { profilePanelTransition, profilePanelVariants } from "../lib/motion";
import { PROFILE_SECTIONS, PROFILE_TABS } from "../lib/profileSections";
import { fetchFollowRequests } from "../services/socialService";
import { fetchCollection, fetchProfile, fetchAchievements } from "../services/userService";

function ProfilePage() {
  const { username } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "movies";
  const section = searchParams.get("section") || "all";
  const { user: currentUser, updateUser } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [requestPending, setRequestPending] = useState(false);
  const [collection, setCollection] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [followListType, setFollowListType] = useState(null);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [followRequestCount, setFollowRequestCount] = useState(0);
  const [sortOrder, setSortOrder] = useState("newest");
  const [genreFilter, setGenreFilter] = useState(null);

  const isOwner = currentUser?.username === username;
  const canViewContent = isOwner || profileData?.canViewContent !== false;
  const isPrivateLocked = profileData?.isPrivateProfile && !canViewContent;
  const canRateTaste = !isOwner && currentUser && canViewContent;
  const panelKey = `${tab}-${section}`;

  const loadProfile = useCallback(async () => {
    setInitialLoading(true);
    try {
      const [profile, progress] = await Promise.all([
        fetchProfile(username),
        fetchAchievements(username)
      ]);
      setProfileData(profile);
      setProgressData(progress);
      setIsFollowing(profile.isFollowing || false);
      setRequestPending(profile.requestPending || false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load profile");
    } finally {
      setInitialLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (section === "taste") {
      setSearchParams({ tab, section: "all" }, { replace: true });
    }
  }, [section, tab, setSearchParams]);

  const loadFollowRequestCount = useCallback(async () => {
    if (!isOwner) return;
    try {
      const list = await fetchFollowRequests();
      setFollowRequestCount(list.length);
    } catch {
      setFollowRequestCount(0);
    }
  }, [isOwner]);

  const loadCollection = useCallback(async () => {
    if (!profileData || section === "taste" || isPrivateLocked) return;
    setContentLoading(true);
    try {
      const data = await fetchCollection(username, tab, section);
      setCollection(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load section");
    } finally {
      setContentLoading(false);
    }
  }, [username, tab, section, profileData, isPrivateLocked]);

  useEffect(() => {
    loadProfile();
    loadFollowRequestCount();
  }, [loadProfile, loadFollowRequestCount]);

  useEffect(() => {
    if (profileData && canViewContent) {
      loadCollection();
    }
  }, [loadCollection, profileData, canViewContent, section]);

  const refreshAll = async () => {
    await Promise.all([loadProfile(), loadFollowRequestCount(), canViewContent ? loadCollection() : null]);
  };

  const handleProfileSaved = (user) => {
    setProfileData((prev) => ({
      ...prev,
      user: { ...prev.user, ...user },
    }));
    updateUser({
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      favoriteCharacters: user.favoriteCharacters,
      ganduCharacters: user.ganduCharacters,
    });
  };

  const setTab = (nextTab) => { setGenreFilter(null); setSearchParams({ tab: nextTab, section: "all" }); };
  const setSection = (nextSection) => { setGenreFilter(null); setSearchParams({ tab, section: nextSection }); };

  if (initialLoading) {
    return <div className="glass-card page-card shimmer">Loading profile...</div>;
  }
  if (!profileData) return <div className="glass-card page-card">Profile not found.</div>;

  return (
    <div className="profile-page">
      <ProfileHero
        profile={profileData.user}
        stats={profileData.stats}
        genreOverall={profileData.genreOverall}
        isOwner={profileData.isOwner || isOwner}
        isFollowing={isFollowing}
        requestPending={requestPending}
        tasteMatchPercent={profileData.tasteMatchPercent}
        canViewContent={canViewContent}
        onFollowChange={({ following, requestPending: pending }) => {
          setIsFollowing(following);
          setRequestPending(pending);
          loadProfile();
        }}
        followRequestCount={followRequestCount}
        requestsOpen={requestsOpen}
        onToggleFollowRequests={() => setRequestsOpen((v) => !v)}
        onEditProfile={() => setEditOpen(true)}
        onCompareProfile={() => setCompareOpen(true)}
        onOpenAchievements={() => setAchievementsOpen(true)}
        onShowFollowList={canViewContent ? setFollowListType : undefined}
        requestsPanel={
          isOwner ? (
            <ProfileRequestsPanel embedded onChanged={(n) => setFollowRequestCount(n)} />
          ) : null
        }
      />

      {isPrivateLocked ? (
        <p className="glass-card panel private-profile-hint">
          This profile is private. Send a follow request to see their posts and lists. Overall genre taste is shown
          above.
        </p>
      ) : null}

      {canViewContent ? (
        <>
          <ProfileTasteSection
            username={username}
            canRate={canRateTaste}
            viewerTasteRatings={profileData.viewerTasteRatings}
            tasteReviews={profileData.tasteReviews}
            onRated={loadProfile}
          />

          <FollowListModal
            username={username}
            type={followListType}
            open={Boolean(followListType)}
            onClose={() => setFollowListType(null)}
          />

          <ProfileTabNav items={PROFILE_TABS} activeId={tab} onChange={setTab} variant="main" />
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "nowrap", overflowX: "auto", gap: "1rem", marginBottom: "0.65rem", paddingBottom: "4px" }}>
            <ProfileTabNav items={PROFILE_SECTIONS} activeId={section} onChange={setSection} variant="sub" style={{ margin: 0 }} />
            <select
              className="glass-card"
              style={{ padding: "0.3rem 0.6rem", borderRadius: "6px", background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)", outline: "none", cursor: "pointer", fontSize: "0.8rem", flexShrink: 0 }}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest" style={{ color: "black", background: "white" }}>Newest</option>
              <option value="oldest" style={{ color: "black", background: "white" }}>Oldest</option>
              <option value="asc" style={{ color: "black", background: "white" }}>Low → High</option>
              <option value="desc" style={{ color: "black", background: "white" }}>High → Low</option>
            </select>
          </div>

          {/* ── Genre Filter Pills ── */}
          {tab !== "music" && (() => {
            const allItems = collection?.items || [];
            const genres = [...new Set(allItems.flatMap(p => p.movie?.genres || p.genres || []))].sort();
            if (genres.length === 0) return null;
            return (
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem", alignItems: "center" }}>
                <button
                  onClick={() => setGenreFilter(null)}
                  style={{
                    padding: "0.2rem 0.7rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: "700",
                    cursor: "pointer", border: "1px solid", transition: "all 0.15s",
                    background: genreFilter === null ? "rgba(255,42,133,0.2)" : "transparent",
                    borderColor: genreFilter === null ? "rgba(255,42,133,0.5)" : "rgba(255,255,255,0.15)",
                    color: genreFilter === null ? "#ff2a85" : "rgba(255,255,255,0.5)",
                  }}
                >All</button>
                {genres.map(g => (
                  <button
                    key={g}
                    onClick={() => setGenreFilter(genreFilter === g ? null : g)}
                    style={{
                      padding: "0.2rem 0.7rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: "700",
                      cursor: "pointer", border: "1px solid", transition: "all 0.15s", whiteSpace: "nowrap",
                      background: genreFilter === g ? "rgba(255,42,133,0.18)" : "transparent",
                      borderColor: genreFilter === g ? "rgba(255,42,133,0.5)" : "rgba(255,255,255,0.12)",
                      color: genreFilter === g ? "#ff2a85" : "rgba(255,255,255,0.45)",
                    }}
                  >{g}</button>
                ))}
              </div>
            );
          })()}

          <div className="profile-content-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={panelKey}
                className="profile-panel-inner"
                variants={profilePanelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={profilePanelTransition}
              >
                {contentLoading ? (
                  <div className="profile-content-skeleton glass-card shimmer">Loading...</div>
                ) : (
                  <ProfileSectionContent
                    data={collection}
                    section={section}
                    tab={tab}
                    isOwner={isOwner}
                    profileUser={profileData.user}
                    onRefresh={refreshAll}
                    sortOrder={sortOrder}
                    genreFilter={genreFilter}
                    isFollowing={isFollowing}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      ) : null}

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        profile={profileData.user}
        onSaved={handleProfileSaved}
      />

      {currentUser && !isOwner && (
        <AnimatePresence>
          <CompareModal
            open={compareOpen}
            onClose={() => setCompareOpen(false)}
            username={username}
          />
        </AnimatePresence>
      )}

      <AchievementsModal
        open={achievementsOpen}
        onClose={() => setAchievementsOpen(false)}
        username={username}
        initialData={progressData}
      />
    </div>
  );
}

export default ProfilePage;
