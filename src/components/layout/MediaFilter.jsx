const FILTERS = [
  { id: "all", label: "All" },
  { id: "movie", label: "Movies" },
  { id: "show", label: "Web Shows" },
  { id: "book", label: "Books" },
  { id: "music", label: "Music" },
];

function MediaFilter({ value, onChange, hideSpoilers, onHideSpoilersChange }) {
  return (
    <div className="glass-card panel media-filter">
      <h4>Browse by type</h4>
      <div className="media-filter-pills">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={value === f.id ? "active" : ""}
            onClick={() => onChange(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <label className="spoiler-filter-check">
        <input
          type="checkbox"
          checked={hideSpoilers}
          onChange={(e) => onHideSpoilersChange(e.target.checked)}
        />
        <span>Hide spoilers</span>
      </label>
    </div>
  );
}

export default MediaFilter;
export { FILTERS };
