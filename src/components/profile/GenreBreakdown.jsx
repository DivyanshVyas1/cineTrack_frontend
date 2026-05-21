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
      <div className="genre-breakdown-header">
        <h4>{title}</h4>
        {subtitle ? <span className="genre-breakdown-subtitle">{subtitle}</span> : null}
      </div>
      <p className="genre-formula-hint">
        Weighted by your ratings: higher scores pull genres more.
      </p>
      <div className="genre-bars">
        {stats.map((g) => (
          <div key={g.genre} className="genre-bar-row">
            <div className="genre-bar-label">
              <span className="genre-bar-name">{g.genre}</span>
              <strong className="genre-bar-pct">{g.percent}%</strong>
            </div>
            <div className="genre-bar-track">
              <div className="genre-bar-fill" style={{ width: `${Math.min(g.percent, 100)}%` }} />
            </div>
            <span className="genre-bar-meta">
              avg {g.avgRating}/10 · {g.count} {g.count === 1 ? "title" : "titles"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GenreBreakdown;
