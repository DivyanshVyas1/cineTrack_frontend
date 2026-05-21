import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../api/client";
import { fetchSearchSuggestions } from "../../services/searchService";

function CharacterSearchField({
  value,
  onChange,
  placeholder = "Search character...",
  compact = false,
}) {
  const [query, setQuery] = useState(value?.name || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(value?.name ? value : null);

  useEffect(() => {
    setQuery(value?.name || "");
    setSelected(value?.name ? value : null);
  }, [value?.name, value?.source]);

  useEffect(() => {
    if (selected || query.trim().length < 2) {
      setSuggestions([]);
      return undefined;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const items = await fetchSearchSuggestions(query, "character");
        setSuggestions(items);
      } catch (err) {
        setSuggestions([]);
        toast.error(getApiErrorMessage(err, "Character search failed"));
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, selected]);

  const pick = (item) => {
    const next = { name: item.title, source: item.source || "wikidata" };
    setSelected(next);
    setQuery(item.title);
    setSuggestions([]);
    onChange?.(next);
  };

  const clear = () => {
    setSelected(null);
    setQuery("");
    onChange?.({ name: "", source: "" });
  };

  if (selected?.name) {
    return (
      <div className={`character-search-field ${compact ? "character-search-field-compact" : ""}`}>
        <div className="character-search-selected">
          <div className="character-search-selected-text">
            <strong>{selected.name}</strong>
            {selected.source ? <span>{selected.source}</span> : null}
          </div>
          <button
            type="button"
            className="character-search-remove"
            onClick={clear}
            aria-label="Clear character"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`character-search-field ${compact ? "character-search-field-compact" : ""}`}>
      <div className="composer-search-wrap character-search-input-wrap">
        <input
          className="character-search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        {loading ? <span className="title-search-hint">Searching...</span> : null}
        {suggestions.length > 0 ? (
          <ul className="composer-suggestions media-suggestions character-search-suggestions">
            {suggestions.map((item) => (
              <li key={item.externalId}>
                <button type="button" onClick={() => pick(item)}>
                  {item.poster ? (
                    <img src={item.poster} alt="" className="suggestion-poster" />
                  ) : (
                    <span className="suggestion-poster suggestion-poster-fallback">?</span>
                  )}
                  <span className="suggestion-meta">
                    <strong>{item.title}</strong>
                    {item.overview ? <em>{item.overview}</em> : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export default CharacterSearchField;
