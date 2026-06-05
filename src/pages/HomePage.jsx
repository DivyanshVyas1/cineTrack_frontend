import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import UserFeedCard from "../components/feed/UserFeedCard";
import FeedPost from "../components/feed/FeedPost";
import LeftSidebar from "../components/layout/LeftSidebar";
import RightSidebar from "../components/layout/RightSidebar";
import {
  filterFeedPosts,
  filterFounderSuggestions,
  filterTrending,
} from "../lib/filterByMedia";
import { useAuth } from "../hooks/useAuth";
import { getHomeFeed } from "../services/feedService";

function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [raw, setRaw] = useState({ feed: [], founderSuggestions: [], trendingWeek: [], tasteSuggestions: [] });
  const [mediaFilter, setMediaFilter] = useState("all");
  const [hideSpoilers, setHideSpoilers] = useState(true);
  const [loading, setLoading] = useState(true);

  const loadFeed = useCallback(async () => {
    try {
      const data = await getHomeFeed(isAuthenticated);
      setRaw(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const feed = useMemo(() => {
    const filtered = filterFeedPosts(raw.feed, mediaFilter, { hideSpoilers });
    return filtered.filter(item => mediaFilter === "music" || item.posts.length >= 3);
  }, [raw.feed, mediaFilter, hideSpoilers]);
  const founderSuggestions = useMemo(
    () => filterFounderSuggestions(raw.founderSuggestions, mediaFilter),
    [raw.founderSuggestions, mediaFilter]
  );
  const trendingWeek = useMemo(
    () => filterTrending(raw.trendingWeek, mediaFilter),
    [raw.trendingWeek, mediaFilter]
  );

  const filterLabel =
    mediaFilter === "all"
      ? ""
      : mediaFilter === "movie"
        ? " movies"
        : mediaFilter === "show"
          ? " web shows"
          : mediaFilter === "music"
            ? " music"
            : " books";

  return (
    <div className="three-col">
      <LeftSidebar
        mediaFilter={mediaFilter}
        onMediaFilterChange={setMediaFilter}
        hideSpoilers={hideSpoilers}
        onHideSpoilersChange={setHideSpoilers}
        tasteSuggestions={raw.tasteSuggestions}
      />
      <section className="feed-stack">
        {loading && <div className="glass-card shimmer panel">Loading public feed...</div>}
        {!loading && feed.length === 0 ? (
          <div className="glass-card panel empty-feed">
            <p>
              No public{filterLabel} posts{hideSpoilers ? " (spoilers hidden)" : ""} yet.
            </p>
            {isAuthenticated ? (
              <p>
                <Link to="/post">Post</Link> something or view your{" "}
                <Link to={`/profile/${user?.username}?tab=movies`}>profile</Link>.
              </p>
            ) : (
              <p>Sign in and set your profile to public to share with the community.</p>
            )}
          </div>
        ) : null}
        {feed.map((item) => {
          if (mediaFilter === "music") {
            return item.posts.map(post => (
              <FeedPost key={post._id} post={{...post, user: item.user, isOwnPost: item.isOwnProfile, isFollowing: item.isFollowing}} onChanged={loadFeed} />
            ));
          }
          return <UserFeedCard key={item._id} feedGroup={item} onChanged={loadFeed} />;
        })}
      </section>
      <RightSidebar founderSuggestions={founderSuggestions} trendingWeek={trendingWeek} />
    </div>
  );
}

export default HomePage;
