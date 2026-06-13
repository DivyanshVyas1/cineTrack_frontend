import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../api/client";
import { fetchMediaSuggestions } from "../../services/movieService";
import MusicAudioPlayer from "./MusicAudioPlayer";

const LABELS = {
  movie: "movie",
  show: "web show",
  series: "web show",
  book: "book",
  music: "track",
};

const PLACEHOLDERS = {
  movie: "Search movie (TMDB)...",
  show: "Search web show (TMDB)...",
  series: "Search web show (TMDB)...",
  book: "Search book (Google Books)...",
  music: "Search music (YouTube Music)...",
};

function TitleSearchField({ mediaType, onSelect, disabled, required = true, className }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const isMusic = mediaType === "music";

  useEffect(() => {
    setQuery("");
    setSelected(null);
    setSuggestions([]);
    onSelect?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaType]);

  useEffect(() => {
    if (selected || query.trim().length < 2) {
      setSuggestions([]);
      return undefined;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const items = await fetchMediaSuggestions(query, mediaType);
        setSuggestions(items);
      } catch (err) {
        setSuggestions([]);
        toast.error(getApiErrorMessage(err, isMusic ? "Music search failed" : "Search failed"));
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, mediaType, selected]);

  const pick = (item) => {
    setSelected(item);
    setQuery(item.title);
    setSuggestions([]);
    onSelect?.(item);
  };

  const clear = () => {
    setSelected(null);
    setQuery("");
    onSelect?.(null);
  };

  const label = LABELS[mediaType] || "title";

  return (
    <div className="title-search-field">
      <div className="composer-search-wrap">
        <input
          className={className}
          required={required && !selected}
          disabled={disabled}
          placeholder={PLACEHOLDERS[mediaType] || `Search ${label}...`}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (selected) {
              setSelected(null);
              onSelect?.(null);
            }
          }}
          autoComplete="off"
        />
        {loading ? <span className="title-search-hint">Searching...</span> : null}
        {suggestions.length > 0 ? (
          <ul className="composer-suggestions media-suggestions">
            {suggestions.map((item) => (
              <li key={`${item.source}-${item.externalId}`}>
                <button type="button" onClick={() => pick(item)}>
                  {item.poster ? (
                    <img src={item.poster} alt="" className="suggestion-poster" />
                  ) : (
                    <span className="suggestion-poster suggestion-poster-fallback">?</span>
                  )}
                  <span className="suggestion-meta">
                    <strong>{item.title}</strong>
                    {isMusic && (item.artistName || item.artist) ? (
                      <em className="suggestion-artist">{item.artistName || item.artist}</em>
                    ) : null}
                    {isMusic && item.durationLabel ? <em>{item.durationLabel}</em> : null}
                    {!isMusic && item.releaseDate ? <em>{item.releaseDate}</em> : null}
                    {!isMusic && item.genres?.length ? (
                      <span className="suggestion-genres">{item.genres.slice(0, 3).join(", ")}</span>
                    ) : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {selected ? (
        <div className="title-search-preview glass-card">
          <button type="button" className="preview-clear btn-ghost" onClick={clear}>
            Change
          </button>
          {selected.poster ? (
            <img src={selected.poster} alt={selected.title} className="preview-poster" />
          ) : null}
          <div className="preview-details" style={{ paddingRight: "60px" }}>
            <strong>{selected.title}</strong>
            {isMusic && (selected.artistName || selected.artist) ? (
              <p>
                <span className="preview-label">Artist</span> {selected.artistName || selected.artist}
              </p>
            ) : null}
            {isMusic && selected.album ? (
              <p>
                <span className="preview-label">Album</span> {selected.album}
              </p>
            ) : null}
            {!isMusic && selected.releaseDate ? (
              <p>
                <span className="preview-label">Release</span> {selected.releaseDate}
              </p>
            ) : null}
            {!isMusic && selected.genres?.length ? (
              <p>
                <span className="preview-label">Genres</span> {selected.genres.join(", ")}
              </p>
            ) : null}
            {isMusic ? (
              <div className="music-preview-actions">
                {selected.previewUrl ? (
                  <MusicAudioPlayer
                    src={selected.previewUrl}
                    durationSeconds={selected.duration || 0}
                  />
                ) : selected.videoId ? (
                  <p className="sidebar-muted">Preview loading may take a few seconds on first play.</p>
                ) : (
                  <p className="sidebar-muted">No audio preview for this track.</p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default TitleSearchField;
