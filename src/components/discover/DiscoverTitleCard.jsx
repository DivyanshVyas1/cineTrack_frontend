import { Link } from "react-router-dom";
import { buildTitleLink } from "../../lib/titleLink";

/* Star rating display */
function StarRating({ rating }) {
  const val = parseFloat(rating);
  const pct = (val / 10) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <div style={{ position: "relative", fontSize: "0.7rem", letterSpacing: "1px", color: "rgba(255,255,255,0.2)" }}>
        ★★★★★
        <div style={{ position: "absolute", top: 0, left: 0, overflow: "hidden", width: `${pct}%`, color: "#f59e0b", whiteSpace: "nowrap" }}>★★★★★</div>
      </div>
      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f59e0b" }}>{val.toFixed(1)}</span>
    </div>
  );
}

function DiscoverTitleCard({ entry, badgeLabel, badgeVariant = "blue", meta }) {
  const item = entry.title || entry.movie || entry;
  const href = buildTitleLink(item);
  const isSong = item.type === "music";
  const spotifyId = item.externalId;

  const handleSpotify = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (spotifyId) window.open(`https://open.spotify.com/track/${spotifyId}`, "_blank");
  };

  return (
    <Link
      to={href}
      className="dtc-card"
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        color: "inherit",
        borderRadius: "14px",
        overflow: "hidden",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
        position: "relative",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Poster */}
      <div style={{ position: "relative", width: "100%", paddingBottom: isSong ? "100%" : "140%", background: "#0f1117", flexShrink: 0 }}>
        {item.poster ? (
          <img
            src={item.poster}
            alt={item.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #1e1e2e, #2a2a3e)",
            fontSize: "2.5rem",
          }}>
            {isSong ? "🎵" : "🎬"}
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)", pointerEvents: "none" }} />

        {/* Rating badge top-left */}
        {badgeLabel && (
          <div style={{
            position: "absolute", top: "8px", left: "8px",
            background: badgeVariant === "blue" ? "rgba(59,130,246,0.85)" : badgeVariant === "pink" ? "rgba(236,72,153,0.85)" : badgeVariant === "amber" ? "rgba(245,158,11,0.85)" : "rgba(34,197,94,0.85)",
            backdropFilter: "blur(4px)",
            color: "#fff", fontSize: "0.68rem", fontWeight: 800,
            padding: "3px 8px", borderRadius: "100px",
          }}>
            {badgeLabel}
          </div>
        )}

        {/* Spotify play button for songs */}
        {isSong && spotifyId && (
          <button
            onClick={handleSpotify}
            style={{
              position: "absolute", bottom: "10px", right: "10px",
              width: "36px", height: "36px", borderRadius: "50%",
              background: "#1DB954",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(29,185,84,0.5)",
              transition: "transform 0.15s, box-shadow 0.15s",
              zIndex: 2,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            title="Open in Spotify"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.496 17.29a.75.75 0 01-1.03.25c-2.826-1.727-6.383-2.117-10.573-1.16a.75.75 0 01-.334-1.462c4.584-1.047 8.516-.597 11.687 1.343a.75.75 0 01.25 1.03zm1.465-3.261a.937.937 0 01-1.288.308c-3.231-1.985-8.156-2.561-11.976-1.402a.938.938 0 01-.54-1.793c4.366-1.322 9.79-.682 13.497 1.599a.937.937 0 01.307 1.288zm.126-3.398c-3.871-2.299-10.26-2.511-13.955-1.389a1.124 1.124 0 01-.648-2.151c4.244-1.284 11.3-1.036 15.762 1.607a1.124 1.124 0 01-1.159 1.933z"/>
            </svg>
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "0.65rem 0.75rem 0.75rem", display: "flex", flexDirection: "column", gap: "3px", flex: 1 }}>
        <h4 style={{ margin: 0, fontSize: "0.88rem", fontWeight: 700, lineHeight: 1.3, color: "#fff", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {item.title}
        </h4>
        {item.artistName && (
          <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {item.artistName}
          </p>
        )}
        {meta && (
          <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>
            {meta}
          </p>
        )}
        {badgeLabel && badgeLabel.includes("/") && (
          <StarRating rating={parseFloat(badgeLabel)} />
        )}
      </div>
    </Link>
  );
}

export default DiscoverTitleCard;
