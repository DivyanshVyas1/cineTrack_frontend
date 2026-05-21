import { useAuth } from "../../hooks/useAuth";
import TasteMatchSuggestions from "../feed/TasteMatchSuggestions";
import { FILTERS } from "./MediaFilter";

function LeftSidebar({
  mediaFilter = "all",
  onMediaFilterChange,
  hideSpoilers = true,
  onHideSpoilersChange,
  tasteSuggestions = [],
}) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user?.username) {
    return (
      <aside className="glass-card panel sidebar-card">
        <p className="sidebar-muted">Sign in to open your profile and taste matches.</p>
      </aside>
    );
  }

  return (
    <div className="left-sidebar-stack">
      <aside className="glass-card panel sidebar-card sidebar-filters-card">
        <h4 className="sidebar-section-heading">Filters</h4>

        <nav className="sidebar-nav sidebar-feed-filters" aria-label="Filter feed by type">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={mediaFilter === f.id ? "active" : ""}
              onClick={() => onMediaFilterChange?.(f.id)}
            >
              {f.label}
            </button>
          ))}
        </nav>

        <label className="spoiler-filter-check sidebar-spoiler-check">
          <input
            type="checkbox"
            checked={hideSpoilers}
            onChange={(e) => onHideSpoilersChange?.(e.target.checked)}
          />
          <span>Hide spoilers</span>
        </label>
      </aside>

      <aside className="glass-card panel sidebar-taste-card">
        <TasteMatchSuggestions suggestions={tasteSuggestions} />
      </aside>
    </div>
  );
}

export default LeftSidebar;
