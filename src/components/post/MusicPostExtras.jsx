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

      {previewUrl ? (
        <div className="music-post-player-card">
          <MusicAudioPlayer src={previewUrl} durationSeconds={duration} />
        </div>
      ) : null}
    </div>
  );
}

export default MusicPostExtras;
