import { useState } from "react";
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
  const [filtersOpen, setFiltersOpen] = useState(false);

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
        <div 
          className="sidebar-mobile-toggle" 
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <h4 className="sidebar-section-heading">Filters</h4>
          <span className="mobile-toggle-icon">{filtersOpen ? "▲" : "▼"}</span>
        </div>

        <div className={`sidebar-collapsible ${filtersOpen ? "open" : ""}`}>
          <nav className="sidebar-nav sidebar-feed-filters" aria-label="Filter feed by type">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={mediaFilter === f.id ? "active" : ""}
                onClick={() => {
                  onMediaFilterChange?.(f.id);
                  setFiltersOpen(false); // Auto close on mobile after selection
                }}
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
        </div>
      </aside>

      <aside className="glass-card panel sidebar-taste-card">
        <TasteMatchSuggestions suggestions={tasteSuggestions} />
      </aside>
    </div>
  );
}

export default LeftSidebar;
