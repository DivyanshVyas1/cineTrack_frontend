import { useState } from "react";
import { Link } from "react-router-dom";
import ProfileAddForm from "../components/profile/ProfileAddForm";
import ProfileTabNav from "../components/profile/ProfileTabNav";
import { useAuth } from "../hooks/useAuth";
import { PROFILE_TABS, getMediaTypeForTab } from "../lib/profileSections";

const HEADINGS = {
  log: (label) => `Log a ${label}`,
  watchlist: (label) => `Add ${label} to watchlist`,
};

function PostPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("movies");
  const mediaType = getMediaTypeForTab(tab);
  const label =
    tab === "movies"
      ? "movie"
      : tab === "web-shows"
        ? "web show"
        : tab === "music"
          ? "track"
          : "book";

  return (
    <div className="post-page">
      <section className="glass-card page-card post-page-header">
        <h2>Post</h2>
        <p className="sidebar-muted">
          Log movies, web shows, books, or music and manage your watchlist. View your collection on{" "}
          <Link to={`/profile/${user?.username}`}>your profile</Link>.
        </p>
      </section>

      <ProfileTabNav items={PROFILE_TABS} activeId={tab} onChange={setTab} variant="main" />

      <div className="post-forms-grid">
        <div className="post-form-cell">
          <ProfileAddForm
            key={`${tab}-log`}
            defaultMediaType={mediaType}
            mode="log"
            heading={HEADINGS.log(label)}
          />
        </div>
        <div className="post-form-cell">
          <ProfileAddForm
            key={`${tab}-watchlist`}
            defaultMediaType={mediaType}
            mode="watchlist"
            heading={HEADINGS.watchlist(label)}
          />
        </div>
      </div>
    </div>
  );
}

export default PostPage;
