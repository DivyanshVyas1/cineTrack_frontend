import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ProfileHero from "../components/profile/ProfileHero";
import ProfileTasteSection from "../components/profile/ProfileTasteSection";
import ProfileRequestsPanel from "../components/profile/ProfileRequestsPanel";
import EditProfileModal from "../components/profile/EditProfileModal";
import FollowListModal from "../components/social/FollowListModal";
import ProfileSectionContent from "../components/profile/ProfileSectionContent";
import ProfileTabNav from "../components/profile/ProfileTabNav";
import { useAuth } from "../hooks/useAuth";
import { profilePanelTransition, profilePanelVariants } from "../lib/motion";
import { PROFILE_SECTIONS, PROFILE_TABS } from "../lib/profileSections";
import { fetchFollowRequests } from "../services/socialService";
import { fetchCollection, fetchProfile } from "../services/userService";

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
  const [initialLoading, setInitialLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [followListType, setFollowListType] = useState(null);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [followRequestCount, setFollowRequestCount] = useState(0);

  const isOwner = currentUser?.username === username;
  const canViewContent = isOwner || profileData?.canViewContent !== false;
  const isPrivateLocked = profileData?.isPrivateProfile && !canViewContent;
  const canRateTaste = !isOwner && currentUser && canViewContent;
  const panelKey = `${tab}-${section}`;

  const loadProfile = useCallback(async () => {
    setInitialLoading(true);
    try {
      const profile = await fetchProfile(username);
      setProfileData(profile);
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

  const setTab = (nextTab) => setSearchParams({ tab: nextTab, section: "all" });
  const setSection = (nextSection) => setSearchParams({ tab, section: nextSection });

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
          <ProfileTabNav items={PROFILE_SECTIONS} activeId={section} onChange={setSection} variant="sub" />

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
                    onRefresh={refreshAll}
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
    </div>
  );
}

export default ProfilePage;
