export default function CastRow({ cast = [], crew = [] }) {
  if (!cast.length && !crew.length) return null;

  return (
    <div className="tdp-section">
      <h3 className="tdp-section-title">Cast &amp; Crew</h3>

      {/* Crew pills — directors/writers */}
      {crew.length > 0 && (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          {crew.map((c) => (
            <div key={`${c.id}-${c.job}`} className="crew-pill">
              {c.photo ? (
                <img src={c.photo} alt={c.name} style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
              ) : (
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>🎬</div>
              )}
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fff" }}>{c.name}</div>
                <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{c.job}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cast horizontal scroll */}
      {cast.length > 0 && (
        <div
          className="cast-scroll"
          style={{ display: "flex", gap: "0.85rem", overflowX: "auto", paddingBottom: "0.5rem", scrollSnapType: "x mandatory" }}
        >
          {cast.map((c) => (
            <div
              key={c.id}
              className="cast-card"
              style={{ flexShrink: 0, scrollSnapAlign: "start", textAlign: "center", width: "90px" }}
            >
              {/* Photo */}
              <div style={{ width: "72px", height: "72px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 0.5rem", border: "2px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)" }}>
                {c.photo ? (
                  <img src={c.photo} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.6rem">🎭</div>`; }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem" }}>🎭</div>
                )}
              </div>
              {/* Name */}
              <div style={{ fontSize: "0.73rem", fontWeight: 700, color: "#fff", lineHeight: 1.2, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {c.name}
              </div>
              {/* Character */}
              {c.character && (
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {c.character}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
