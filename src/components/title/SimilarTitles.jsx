import { Link } from "react-router-dom";

export default function SimilarTitles({ recommendations = [] }) {
  if (!recommendations.length) return null;

  return (
    <div className="tdp-section">
      <h3 className="tdp-section-title">You Might Also Like</h3>
      <div className="similar-grid">
        {recommendations.map((item) => {
          const href = `/title?type=${item.type}&title=${encodeURIComponent(item.title)}&externalId=${item.externalId}`;
          return (
            <Link
              key={item.externalId}
              to={href}
              className="similar-card"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {/* Poster */}
              <div style={{ position: "relative", paddingBottom: "145%", borderRadius: "10px", overflow: "hidden", background: "#111" }}>
                {item.poster ? (
                  <img
                    src={item.poster}
                    alt={item.title}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>🎬</div>
                )}
                {/* Gradient overlay */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)", pointerEvents: "none" }} />
                {/* Rating badge */}
                {item.rating && (
                  <div style={{ position: "absolute", top: "6px", left: "6px", background: "rgba(0,0,0,0.75)", borderRadius: "6px", padding: "2px 7px", fontSize: "0.68rem", fontWeight: 800, color: "#f59e0b", backdropFilter: "blur(4px)" }}>
                    ★ {item.rating}
                  </div>
                )}
              </div>
              {/* Title */}
              <div style={{ marginTop: "0.5rem", fontSize: "0.78rem", fontWeight: 600, color: "#fff", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.3 }}>
                {item.title}
              </div>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", marginTop: "2px", textTransform: "capitalize" }}>
                {item.type}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
