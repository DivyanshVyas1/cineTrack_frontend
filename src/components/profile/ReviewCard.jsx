import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import Avatar from "../ui/Avatar";

function ReviewCard({ review, showAuthor = false }) {
  const author = review.user;

  return (
    <article className="glass-card review-card" style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="review-card-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        {showAuthor && author ? (
          <Link to={`/profile/${author.username}`} className="feed-author">
            <Avatar name={author.name} src={author.avatar} size={36} />
            <div>
              <strong>{author.name}</strong>
              <span>@{author.username}</span>
            </div>
          </Link>
        ) : (
          <div className="review-card-self-header" style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
            {showAuthor ? "Deleted User" : "Your Review"}
          </div>
        )}
        <Badge variant="blue" style={{ flexShrink: 0 }}>{review.rating}/10</Badge>
      </div>

      <div className="review-card-content" style={{ fontSize: "0.95rem", lineHeight: "1.5", marginTop: "0.2rem" }}>
        {review.note ? <p style={{ margin: 0 }}>{review.note}</p> : <p className="sidebar-muted" style={{ margin: 0, fontStyle: "italic" }}>Rated without a written review.</p>}
        {review.isSpoiler ? <div style={{ marginTop: "0.8rem" }}><Badge variant="amber">Spoiler</Badge></div> : null}
      </div>

      <div style={{ marginTop: "0.2rem" }}>
        <span className="review-date" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
    </article>
  );
}

export default ReviewCard;

