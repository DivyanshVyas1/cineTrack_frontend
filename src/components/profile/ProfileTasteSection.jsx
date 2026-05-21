import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../api/client";
import { rateUserTaste } from "../../services/userService";
import RatingSlider from "../ui/RatingSlider";

const CATEGORIES = [
  { id: "movie", label: "Movies" },
  { id: "show", label: "Web shows" },
  { id: "book", label: "Books" },
];

function CompactTasteForm({ username, mediaType, label, existing, onRated }) {
  const [score, setScore] = useState(8);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  if (existing) {
    return (
      <p className="taste-compact-done">
        {label}: <strong>{existing.score}/10</strong>
        {existing.comment ? ` — ${existing.comment}` : ""}
      </p>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await rateUserTaste(username, { mediaType, score: Number(score), comment: comment.trim() });
      toast.success(`${label} taste rated`);
      onRated?.();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.info(`You already rated ${label.toLowerCase()} taste`);
        onRated?.();
        return;
      }
      toast.error(getApiErrorMessage(err, "Failed to rate"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="taste-compact-form" onSubmit={submit}>
      <span className="taste-compact-label">{label}</span>
      <RatingSlider value={score} onChange={setScore} compact />
      <input
        placeholder="Short comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit" className="btn-primary btn-sm" disabled={saving}>
        {saving ? "..." : "Rate"}
      </button>
    </form>
  );
}

function ProfileTasteSection({ username, canRate, viewerTasteRatings, tasteReviews, onRated }) {
  const [activeCat, setActiveCat] = useState("movie");
  const reviews = tasteReviews || [];

  if (!canRate && reviews.length === 0) return null;

  const activeLabel = CATEGORIES.find((c) => c.id === activeCat)?.label || "Movies";
  const existing = viewerTasteRatings?.[activeCat === "show" ? "show" : activeCat];

  return (
    <section className="glass-card profile-taste-section">
      <h4>Rate taste</h4>
      {canRate ? (
        <>
          <p className="sidebar-muted">Rate this user once per category.</p>
          <div className="taste-category-pills">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={activeCat === c.id ? "active" : ""}
                onClick={() => setActiveCat(c.id)}
              >
                {c.label}
                {viewerTasteRatings?.[c.id] ? " ✓" : ""}
              </button>
            ))}
          </div>
          <CompactTasteForm
            username={username}
            mediaType={activeCat}
            label={activeLabel}
            existing={existing}
            onRated={onRated}
          />
        </>
      ) : null}

      {reviews.length > 0 ? (
        <div className="taste-reviews-mini">
          <span className="section-subtitle">Taste reviews</span>
          <ul>
            {reviews.slice(0, 5).map((r) => (
              <li key={r._id}>
                <Link to={`/profile/${r.rater?.username}`}>{r.rater?.name}</Link>
                <span className="badge badge-blue">{r.score}/10</span>
                <em>
                  {r.mediaType === "movie" ? "Movies" : r.mediaType === "show" ? "Web shows" : "Books"}
                </em>
                {r.comment ? <p>{r.comment}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="sidebar-muted">No taste reviews yet.</p>
      )}
    </section>
  );
}

export default ProfileTasteSection;
