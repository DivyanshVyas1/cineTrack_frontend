import { Link } from "react-router-dom";
import { buildTitleLink } from "../../lib/titleLink";
import { motion } from "framer-motion";

function RightSidebar({ founderSuggestions = [], trendingWeek = [] }) {
  const suggestionsList = Array.isArray(founderSuggestions) ? founderSuggestions : (founderSuggestions?.items || []);
  const matchedGenre = !Array.isArray(founderSuggestions) ? founderSuggestions?.matchedGenre : null;

  return (
    <aside className="panel-stack" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Admin Suggestions Panel */}
      <div className="glass-card panel" style={{ padding: "1.2rem", borderRadius: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
          <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#fff" }}>Admin Suggestions</h4>
        </div>
        {matchedGenre && (
          <p className="sidebar-muted" style={{ marginBottom: "1.2rem", fontSize: "0.78rem" }}>
            {matchedGenre === "Top Rated" ? "Top rated web shows from admin" : `Because you like ${matchedGenre}`}
          </p>
        )}
        
        {suggestionsList.length === 0 ? (
          <p className="sidebar-muted">No suggestions right now.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {suggestionsList.map((entry, i) => {
              const item = entry.movie || entry;
              const poster = item.poster || entry.poster;
              const title = item.title || entry.title;
              return (
                <motion.div
                  key={entry._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.1 }}
                >
                  <Link
                    to={buildTitleLink(item)}
                    style={{
                      display: "flex",
                      gap: "0.8rem",
                      alignItems: "center",
                      textDecoration: "none",
                      padding: "0.5rem",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{
                        position: "absolute", inset: "-2px", borderRadius: "6px",
                        background: "linear-gradient(135deg, rgba(251,191,36,0.3), rgba(245,158,11,0.3))",
                        filter: "blur(4px)", zIndex: 0,
                      }} />
                      {poster ? (
                        <img 
                          src={poster} 
                          alt={title} 
                          style={{ position: "relative", zIndex: 1, width: "42px", height: "63px", objectFit: "cover", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)" }} 
                        />
                      ) : (
                        <div style={{ position: "relative", zIndex: 1, width: "42px", height: "63px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                          🎬
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ display: "block", color: "#fff", fontSize: "0.85rem", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "0.15rem" }}>
                        {title}
                      </strong>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.3 }}>
                        {entry.note || "Recommended for you"}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Community Trending Panel */}
      <div className="glass-card panel" style={{ padding: "1.2rem", borderRadius: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
          <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#fff" }}>Community Trending</h4>
        </div>
        
        {trendingWeek.length === 0 ? (
          <p className="sidebar-muted">No watches in this category this week.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {(() => {
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
                  <div key={label}>
                    <h5 style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.6rem", fontWeight: "700" }}>
                      {label}
                    </h5>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {items.slice(0, 3).map((entry, i) => {
                        const item = entry.title || entry.movie || entry;
                        const rating = Number(entry.avgRating || 0);
                        const ratingColor = rating >= 8.5 ? "#4ade80" : rating >= 7 ? "#fbbf24" : rating >= 5 ? "#fb923c" : "#f87171";
                        const poster = item.poster;
                        
                        return (
                          <Link 
                            key={`${item._id}-${i}`} 
                            to={buildTitleLink(item)}
                            style={{
                              display: "flex",
                              gap: "0.8rem",
                              alignItems: "center",
                              textDecoration: "none",
                              padding: "0.5rem",
                              borderRadius: "10px",
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.05)",
                              transition: "all 0.2s ease"
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                              e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                              e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                              e.currentTarget.style.transform = "translateY(0)";
                            }}
                          >
                            <div style={{ position: "relative", flexShrink: 0 }}>
                              {poster ? (
                                <img 
                                  src={poster} 
                                  alt={item.title} 
                                  style={{ position: "relative", zIndex: 1, width: "42px", height: "63px", objectFit: "cover", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)" }} 
                                />
                              ) : (
                                <div style={{ position: "relative", zIndex: 1, width: "42px", height: "63px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                                  🎬
                                </div>
                              )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <strong style={{ display: "block", color: "#fff", fontSize: "0.85rem", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "0.2rem" }}>
                                {item.title}
                              </strong>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)" }}>
                                  {entry.watchedCount} views
                                </span>
                                <span style={{ 
                                  fontSize: "0.7rem", 
                                  fontWeight: "800", 
                                  color: ratingColor,
                                  background: "rgba(0,0,0,0.3)",
                                  padding: "1px 5px",
                                  borderRadius: "4px",
                                  border: `1px solid ${ratingColor}33`
                                }}>
                                  ★ {rating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>
    </aside>
  );
}

export default RightSidebar;
