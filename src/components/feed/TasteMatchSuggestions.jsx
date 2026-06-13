import { Link } from "react-router-dom";
import Avatar from "../ui/Avatar";

function getPillClass(percent) {
  if (percent >= 80) return "high";
  if (percent >= 60) return "good";
  if (percent >= 40) return "ok";
  return "low";
}

function getBarColor(percent) {
  if (percent >= 80) return "#4ade80";
  if (percent >= 60) return "#fbbf24";
  if (percent >= 40) return "#fb923c";
  return "#f87171";
}

function TasteMatchSuggestions({ suggestions = [] }) {
  if (!suggestions.length) {
    return (
      <div>
        <h4>Taste matches</h4>
        <p className="sidebar-muted">Log more titles to get user suggestions.</p>
      </div>
    );
  }

  return (
    <div>
      <h4>Taste matches</h4>
      <p className="sidebar-muted" style={{ marginBottom: "0.6rem" }}>Based on shared genres and ratings</p>
      <ul className="taste-match-list">
        {suggestions.map((entry) => {
          const percent = entry.tasteMatchPercent;
          return (
            <li key={entry.user._id}>
              <Link to={`/profile/${entry.user.username}`} className="taste-match-item">
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    position: "absolute", inset: "-2px", borderRadius: "0.7rem",
                    background: "linear-gradient(135deg, rgba(255,42,133,0.2), rgba(120,80,255,0.2))",
                    filter: "blur(4px)", zIndex: 0,
                  }} />
                  <div style={{ position: "relative", zIndex: 1, borderRadius: "0.6rem", overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.08)" }}>
                    <Avatar name={entry.user.name} src={entry.user.avatar} size={34} />
                  </div>
                </div>
                <div className="taste-match-item-info">
                  <strong>{entry.user.name}</strong>
                  <span>@{entry.user.username}</span>
                  <div className="taste-match-bar-wrap">
                    <div
                      className="taste-match-bar"
                      style={{ width: `${percent}%`, background: getBarColor(percent) }}
                    />
                  </div>
                </div>
                <em className={`taste-match-pill ${getPillClass(percent)}`}>
                  {percent}% match
                </em>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TasteMatchSuggestions;
