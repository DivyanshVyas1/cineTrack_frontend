import { Link } from "react-router-dom";
import Avatar from "../ui/Avatar";

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
      <p className="sidebar-muted">Based on shared genres and ratings</p>
      <ul className="taste-match-list">
        {suggestions.map((entry) => (
          <li key={entry.user._id}>
            <Link to={`/profile/${entry.user.username}`} className="taste-match-item">
              <Avatar name={entry.user.name} src={entry.user.avatar} size={32} />
              <div>
                <strong>{entry.user.name}</strong>
                <span>@{entry.user.username}</span>
              </div>
              <em className="taste-match-pill">{entry.tasteMatchPercent}% match</em>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TasteMatchSuggestions;
