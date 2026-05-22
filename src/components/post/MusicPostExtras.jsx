import { Link } from "react-router-dom";
import { buildTitleLink } from "../../lib/titleLink";
import MusicAudioPlayer from "./MusicAudioPlayer";

function MusicPostExtras({ post, variant = "feed", showTitle = false, linkTitle = false }) {
  if (post.type !== "music" && post.movie?.type !== "music") return null;

  const title = post.title || post.movie?.title;
  const poster = post.poster || post.movie?.poster || post.movie?.backdrop;
  const artist = post.artistName || post.movie?.artistName;
  const videoId = post.youtubeVideoId || post.movie?.youtubeVideoId;
  const duration = post.duration || post.movie?.duration || 0;
  const previewUrl =
    post.previewUrl ||
    post.movie?.previewUrl ||
    (videoId ? `/api/music/preview/${videoId}` : "");
  const titleHref = linkTitle ? buildTitleLink(post) : null;

  const titleNode = showTitle && title ? (
    <h3 className="music-post-title">
      {titleHref ? <Link to={titleHref}>{title}</Link> : title}
    </h3>
  ) : null;

  return (
    <div className={`music-post-block music-post-block--${variant}`}>
      <div className="music-post-main">
        {titleHref ? (
          <Link to={titleHref} className="music-post-cover-link">
            {poster ? (
              <img src={poster} alt={title || "Track cover"} className="music-post-cover" />
            ) : (
              <div className="music-post-cover music-post-cover-fallback" aria-hidden>
                🎵
              </div>
            )}
          </Link>
        ) : (
          <>
            {poster ? (
              <img src={poster} alt={title || "Track cover"} className="music-post-cover" />
            ) : (
              <div className="music-post-cover music-post-cover-fallback" aria-hidden>
                🎵
              </div>
            )}
          </>
        )}
        <div className="music-post-info">
          {showTitle && title ? (
            <div className="music-post-title-row">
              {titleHref ? (
                <Link to={titleHref} className="music-post-title-link">
                  {titleNode}
                </Link>
              ) : (
                titleNode
              )}
            </div>
          ) : null}
          {artist ? (
            <p className="music-post-artist">
              <span className="music-post-artist-label">Artist</span>
              {artist}
            </p>
          ) : null}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginTop: "1rem" }}>
        {previewUrl ? (
          <div className="music-post-player-card" style={{ flexGrow: 1, margin: 0 }}>
            <MusicAudioPlayer src={previewUrl} durationSeconds={duration} />
          </div>
        ) : (
          <div style={{ flexGrow: 1 }} />
        )}
        <a
          href={`https://open.spotify.com/search/${encodeURIComponent(`${title || ""} ${artist || ""}`.trim())}/tracks`}
          target="_blank"
          rel="noopener noreferrer"
          title="Open in Spotify"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            flexShrink: 0,
            transition: "all 0.2s ease",
            cursor: "pointer"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
          }}
        >
          <img src="/spotify.png" alt="Spotify" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
        </a>
      </div>
    </div>
  );
}

export default MusicPostExtras;
