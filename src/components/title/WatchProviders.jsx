// OTT provider name → deep-link generator
const getProviderLink = (name, title) => {
  const q = encodeURIComponent(title || "");
  const n = (name || "").toLowerCase();
  if (n.includes("netflix")) return `https://www.netflix.com/search?q=${q}`;
  if (n.includes("prime") || n.includes("amazon")) return `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${q}`;
  if (n.includes("hotstar") || n.includes("disney")) return `https://www.hotstar.com/in/search?q=${q}`;
  if (n.includes("apple")) return `https://tv.apple.com/search?term=${q}`;
  if (n.includes("jio")) return `https://www.jiocinema.com/search/${q}`;
  if (n.includes("mubi")) return `https://mubi.com/en/in/films`;
  if (n.includes("zee")) return `https://www.zee5.com/search?q=${q}`;
  if (n.includes("sony")) return `https://www.sonyliv.com/search?search_query=${q}`;
  if (n.includes("sun")) return `https://www.sunnxt.com/search?q=${q}`;
  return null;
};

const TYPE_LABEL = { stream: "Stream", rent: "Rent", buy: "Buy" };
const TYPE_COLOR = { stream: "#22c55e", rent: "#f59e0b", buy: "#60a5fa" };

export default function WatchProviders({ providers = [], title = "" }) {
  if (!providers.length) return null;

  return (
    <div className="tdp-section">
      <h3 className="tdp-section-title">Where to Watch</h3>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {providers.map((p) => {
          const link = getProviderLink(p.name, title);
          const tag = TYPE_LABEL[p.type] || "";
          const tagColor = TYPE_COLOR[p.type] || "#fff";

          const content = (
            <div
              className="ott-chip"
              style={{ cursor: link ? "pointer" : "default" }}
            >
              {p.logo ? (
                <img
                  src={p.logo}
                  alt={p.name}
                  style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "contain", background: "#fff", padding: "3px" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🎬</div>
              )}
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{p.name}</div>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: tagColor, textTransform: "uppercase", letterSpacing: "0.5px" }}>{tag}</div>
              </div>
              {link && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5">
                  <path d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
              )}
            </div>
          );

          return link ? (
            <a key={p.id} href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              {content}
            </a>
          ) : (
            <div key={p.id}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
