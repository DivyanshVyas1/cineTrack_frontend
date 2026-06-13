import { Link } from "react-router-dom";
import { buildTitleLink } from "../../lib/titleLink";
import MusicAudioPlayer from "./MusicAudioPlayer";
import PostRatingBadge from "./PostRatingBadge";

// Spotify SVG Icon
function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#1DB954">
      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );
}

// YouTube Music SVG Icon
function YTMusicIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#FF0000">
      <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L16.2 12l-6.516 3.54z"/>
    </svg>
  );
}

function StreamingButton({ href, label, icon, accentColor }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={`Open in ${label}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.35rem 0.75rem",
        borderRadius: "8px",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid rgba(255,255,255,0.08)`,
        color: "rgba(255,255,255,0.6)",
        fontSize: "0.72rem",
        fontWeight: "600",
        textDecoration: "none",
        letterSpacing: "0.02em",
        flexShrink: 0,
        transition: "all 0.18s ease",
        whiteSpace: "nowrap",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = `${accentColor}18`;
        e.currentTarget.style.borderColor = `${accentColor}55`;
        e.currentTarget.style.color = "#fff";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.color = "rgba(255,255,255,0.6)";
      }}
    >
      {icon}
      {label}
    </a>
  );
}

function MusicPostExtras({ post, variant = "feed", showTitle = false, linkTitle = false, showRating = false, date = null }) {
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

  const searchQuery = encodeURIComponent(`${title || ""} ${artist || ""}`.trim());
  const spotifyUrl = `https://open.spotify.com/search/${searchQuery}`;
  const ytMusicUrl = `https://music.youtube.com/search?q=${searchQuery}`;

  const titleNode = showTitle && title ? (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <h3 className="music-post-title">
        {titleHref ? <Link to={titleHref}>{title}</Link> : title}
      </h3>
      {showRating && post.rating ? <PostRatingBadge rating={post.rating} /> : null}
    </div>
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
              {titleNode}
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

      {/* Audio Player */}
      {previewUrl ? (
        <div className="music-post-player-card" style={{ margin: "1rem 0 0.6rem" }}>
          <MusicAudioPlayer src={previewUrl} durationSeconds={duration} />
        </div>
      ) : (
        <div style={{ marginTop: "0.75rem" }} />
      )}

      {/* Streaming Buttons Row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <StreamingButton
          href={spotifyUrl}
          label="Spotify"
          icon={<SpotifyIcon />}
          accentColor="#1DB954"
        />
        <StreamingButton
          href={ytMusicUrl}
          label="YT Music"
          icon={<YTMusicIcon />}
          accentColor="#FF0000"
        />
        {date && (
          <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: "rgba(255,255,255,0.25)", fontWeight: "500" }}>
            {date}
          </span>
        )}
      </div>
    </div>
  );
}

export default MusicPostExtras;
