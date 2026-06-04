import Badge from "../ui/Badge";

function GenreBreakdown({
  stats,
  title = "Genre taste",
  subtitle,
  embedded = false,
}) {
  const rootClass = [
    "genre-breakdown",
    embedded ? "genre-breakdown--embedded" : "glass-card",
    !stats?.length ? "genre-breakdown--empty" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (!stats?.length) {
    return (
      <div className={rootClass}>
        <div className="genre-breakdown-header">
          <h4>{title}</h4>
          {subtitle ? <span className="genre-breakdown-subtitle">{subtitle}</span> : null}
        </div>
        <p className="sidebar-muted">Log rated posts with genres to see your breakdown.</p>
      </div>
    );
  }
  return (
    <div className={rootClass}>
      <div className="genre-bars">
        {stats.slice(0, 4).map((g) => (
          <div key={g.genre} className="genre-bar-row">
            <div className="genre-bar-label">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="genre-bar-name" style={{ textTransform: "capitalize" }}>
                  {g.genre}
                </span>
                <Badge variant="blue" style={{ fontSize: "0.7em", padding: "0.1rem 0.5rem" }}>
                  {g.avgRating}/10
                </Badge>
              </div>
              <strong className="genre-bar-pct">{g.percent}%</strong>
            </div>
            <div className="genre-bar-track">
              <div className="genre-bar-fill" style={{ width: `${Math.min(g.percent, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GenreBreakdown;
