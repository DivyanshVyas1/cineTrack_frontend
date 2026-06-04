import { Link } from "react-router-dom";
import PostOwnerToolbar from "../post/PostOwnerToolbar";
import { buildTitleLink } from "../../lib/titleLink";

function PostCard({ post, canEdit, onChanged, isWatchlist = false }) {
  const title = post.title || post.movie?.title;
  const poster = post.poster || post.movie?.poster;
  const rating = post.rating;

  return (
    <article style={{ position: "relative", borderRadius: "8px", overflow: "hidden", textDecoration: "none", display: "block", aspectRatio: "2/3" }}>
      <Link to={buildTitleLink(post.movie || post)} style={{ display: "block", width: "100%", height: "100%" }}>
        {poster ? (
          <img src={poster} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", backgroundColor: "var(--bg)", display: "block", transition: "transform 0.2s ease" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", backgroundColor: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", textAlign: "center", padding: "1rem", boxSizing: "border-box" }}>
            {title}
          </div>
        )}
        {!isWatchlist && (
          <div style={{ position: "absolute", top: "8px", left: "8px", background: "rgba(0,0,0,0.8)", color: "white", padding: "4px 8px", borderRadius: "6px", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold" }}>
            <span style={{ color: "#ffb400" }}>★</span> {rating ? rating.toFixed(1) : "0.0"}
          </div>
        )}
      </Link>
      {canEdit && (
        <div style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.7)", borderRadius: "4px", padding: "2px" }}>
          <PostOwnerToolbar post={post} onChanged={onChanged} menuOnly />
        </div>
      )}
    </article>
  );
}

export default PostCard;
