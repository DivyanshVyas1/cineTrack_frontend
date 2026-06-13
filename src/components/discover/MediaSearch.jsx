import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TitleSearchField from "../post/TitleSearchField";
import { buildTitleLink } from "../../lib/titleLink";

function MediaSearch() {
  const [mediaType, setMediaType] = useState("movie");
  const navigate = useNavigate();

  const handleSelect = (item) => {
    if (item && item.title) {
      navigate(buildTitleLink({ type: mediaType, title: item.title, externalId: item.externalId }));
    }
  };

  return (
    <section className="glass-card panel discover-search" style={{ overflow: "visible", position: "relative", zIndex: 10 }}>
      <h4>Find titles</h4>
      <div className="discover-media-search-row" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <select 
          className="discover-media-type-select" 
          value={mediaType} 
          onChange={(e) => setMediaType(e.target.value)}
          style={{
            padding: "0 12px",
            borderRadius: "0.65rem",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            backgroundColor: "#0b1324",
            color: "var(--text-primary)",
            outline: "none",
            height: "44px",
            minWidth: "100px",
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          <option value="movie">Movie</option>
          <option value="series">Show</option>
          <option value="music">Music</option>
          <option value="book">Book</option>
        </select>
        <div style={{ flex: 1, position: "relative" }}>
          <TitleSearchField mediaType={mediaType} onSelect={handleSelect} required={false} className="discover-search-input" />
        </div>
      </div>
    </section>
  );
}

export default MediaSearch;
