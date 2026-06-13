import { useState } from "react";
import { Link } from "react-router-dom";
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
      <div style={{ display: "flex", gap: "0.8rem", alignItems: "stretch", marginBottom: "0" }}>
        <aside className="glass-card sidebar-filters-card" style={{ flex: 1, margin: 0, padding: "0.8rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div 
            className="sidebar-mobile-toggle" 
            onClick={() => setFiltersOpen(!filtersOpen)}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", userSelect: "none" }}
          >
            <h4 className="sidebar-section-heading" style={{ margin: 0 }}>Filters</h4>
            <span className="mobile-toggle-icon" style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{filtersOpen ? "▲" : "▼"}</span>
          </div>

          <div className={`sidebar-collapsible ${filtersOpen ? "open" : ""}`} style={{ marginTop: filtersOpen ? "1rem" : "0", display: filtersOpen ? "block" : "none" }}>
            <nav className="sidebar-nav sidebar-feed-filters" aria-label="Filter feed by type">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={mediaFilter === f.id ? "active" : ""}
                  onClick={() => {
                    onMediaFilterChange?.(f.id);
                    setFiltersOpen(false);
                  }}
                >
                  {f.label}
                </button>
              ))}
            </nav>

            <label className="spoiler-filter-check sidebar-spoiler-check" style={{ marginTop: "1rem" }}>
              <input
                type="checkbox"
                checked={hideSpoilers}
                onChange={(e) => onHideSpoilersChange?.(e.target.checked)}
              />
              <span>Hide spoilers</span>
            </label>
          </div>
        </aside>

        <Link
          to={`/profile/${user.username}`}
          className="glass-card"
          style={{
            flex: 1,
            margin: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            textDecoration: "none",
            color: "var(--text)",
            fontWeight: "600",
            padding: "0.8rem"
          }}
        >
          Your Profile
        </Link>
      </div>

      <aside className="glass-card panel sidebar-taste-card">
        <TasteMatchSuggestions suggestions={tasteSuggestions} />
      </aside>
    </div>
  );
}

export default LeftSidebar;
