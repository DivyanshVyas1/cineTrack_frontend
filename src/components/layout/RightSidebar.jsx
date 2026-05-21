import { Link } from "react-router-dom";
import { buildTitleLink } from "../../lib/titleLink";

function RightSidebar({ founderSuggestions = [], trendingWeek = [] }) {
  return (
    <aside className="panel-stack">
      <div className="glass-card panel">
        <h4>Founder Suggestions</h4>
        {founderSuggestions.length === 0 ? (
          <p className="sidebar-muted">No suggestions for this category.</p>
        ) : (
          founderSuggestions.map((entry) => (
            <div key={entry._id} className="sidebar-item">
              <Link to={buildTitleLink(entry.movie || entry)}>{entry.movie?.title}</Link>
              <p>{entry.note}</p>
            </div>
          ))
        )}
      </div>

      <div className="glass-card panel">
        <h4>Community Trending (last 7 days)</h4>
        {trendingWeek.length === 0 ? (
          <p className="sidebar-muted">No watches in this category this week.</p>
        ) : (
          (() => {
            const getType = (e) => (e.title || e.movie || e).type;
            const groups = {
              "Movies": trendingWeek.filter(e => getType(e) === "movie"),
              "Web Series": trendingWeek.filter(e => getType(e) === "show" || getType(e) === "series"),
              "Books": trendingWeek.filter(e => getType(e) === "book"),
              "Music": trendingWeek.filter(e => getType(e) === "music")
            };

            return Object.entries(groups).map(([label, items]) => {
              if (items.length === 0) return null;
              return (
                <div key={label} style={{ marginBottom: "1rem" }}>
                  <h5 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>{label}</h5>
                  {items.slice(0, 5).map((entry, i) => (
                    <div key={`${(entry.title || entry.movie || entry)._id}-${i}`} className="trending-row">
                      <Link to={buildTitleLink(entry.title || entry.movie || entry)}>
                        {entry.title?.title || entry.movie?.title}
                      </Link>
                      <span>
                        {entry.watchedCount} watches · {Number(entry.avgRating || 0).toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              );
            });
          })()
        )}
      </div>
    </aside>
  );
}

export default RightSidebar;
