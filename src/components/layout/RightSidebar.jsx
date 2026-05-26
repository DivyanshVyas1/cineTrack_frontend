import { Link } from "react-router-dom";
import { buildTitleLink } from "../../lib/titleLink";

function RightSidebar({ founderSuggestions = [], trendingWeek = [] }) {
  const suggestionsList = Array.isArray(founderSuggestions) ? founderSuggestions : (founderSuggestions?.items || []);
  const matchedGenre = !Array.isArray(founderSuggestions) ? founderSuggestions?.matchedGenre : null;

  return (
    <aside className="panel-stack">
      <div className="glass-card panel">
        <h4>Admin Suggestions</h4>
        {matchedGenre && (
          <p className="sidebar-muted" style={{ marginBottom: "1rem", fontSize: "0.85rem" }}>
            {matchedGenre === "Top Rated" ? "Top rated web shows from admin" : `Because you like ${matchedGenre}`}
          </p>
        )}
        {suggestionsList.length === 0 ? (
          <p className="sidebar-muted">No suggestions for this category.</p>
        ) : (
          suggestionsList.map((entry) => (
            <div key={entry._id} className="sidebar-item" style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "1rem" }}>
              {entry.movie?.poster || entry.poster ? (
                <img 
                  src={entry.movie?.poster || entry.poster} 
                  alt={entry.movie?.title || entry.title} 
                  style={{ width: "50px", height: "75px", objectFit: "cover", borderRadius: "4px" }} 
                />
              ) : null}
              <div>
                <Link to={buildTitleLink(entry.movie || entry)} style={{ display: "block", fontWeight: "bold", marginBottom: "4px" }}>
                  {entry.movie?.title || entry.title}
                </Link>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>{entry.note}</p>
              </div>
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
                  {items.slice(0, 3).map((entry, i) => (
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
