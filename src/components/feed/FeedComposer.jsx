import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../api/client";
import { createMovie, searchMovies } from "../../services/movieService";
import { createReview } from "../../services/reviewService";
import { addToList } from "../../services/userService";

const LABELS = {
  movie: "movie",
  show: "web show",
  book: "book",
};

function FeedComposer({ onPosted, defaultMediaType = "movie", heading }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [mediaType, setMediaType] = useState(defaultMediaType);
  const [rating, setRating] = useState(8);
  const [note, setNote] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [addWatchlist, setAddWatchlist] = useState(false);
  const [addFavorite, setAddFavorite] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMediaType(defaultMediaType);
  }, [defaultMediaType]);

  useEffect(() => {
    if (!query.trim() || selectedMovie) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const items = await searchMovies(query, mediaType);
        setSuggestions(items);
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, selectedMovie, mediaType]);

  const pickMovie = (movie) => {
    setSelectedMovie(movie);
    setQuery(movie.title);
    setSuggestions([]);
    setNewTitle("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let movieId = selectedMovie?._id;
      if (!movieId) {
        const title = newTitle.trim() || query.trim();
        if (!title) throw new Error(`Select or enter a ${LABELS[mediaType]} title`);
        const created = await createMovie({ title, type: mediaType });
        movieId = created._id;
      }

      await createReview({
        movie: movieId,
        rating: Number(rating),
        note,
        isSpoiler,
      });

      if (addWatchlist) await addToList(movieId, "watchlist");
      if (addFavorite) await addToList(movieId, "favorite");

      toast.success("Added to your profile");
      setQuery("");
      setNewTitle("");
      setSelectedMovie(null);
      setNote("");
      setRating(8);
      setIsSpoiler(false);
      setAddWatchlist(false);
      setAddFavorite(false);
      onPosted?.();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to add"));
    } finally {
      setSubmitting(false);
    }
  };

  const label = LABELS[mediaType] || "title";

  return (
    <form className="glass-card feed-composer" onSubmit={submit}>
      <h3>{heading || `Log a new ${label}`}</h3>

      <div className="composer-search-wrap">
        <input
          placeholder={`Search ${label}s in database...`}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedMovie(null);
          }}
        />
        {suggestions.length > 0 ? (
          <ul className="composer-suggestions">
            {suggestions.map((m) => (
              <li key={m._id}>
                <button type="button" onClick={() => pickMovie(m)}>
                  {m.title}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {!selectedMovie ? (
        <input
          placeholder={`Or add new ${label} title if not found`}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
      ) : (
        <p className="composer-selected">Selected: {selectedMovie.title}</p>
      )}

      <textarea
        placeholder="Your notes (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
      />

      <div className="composer-actions">
        <label className="rating-label">
          Rating
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          <strong>{rating}/10</strong>
        </label>
        <label className="spoiler-check">
          <input type="checkbox" checked={isSpoiler} onChange={(e) => setIsSpoiler(e.target.checked)} />
          Spoilers
        </label>
        <label className="spoiler-check">
          <input type="checkbox" checked={addWatchlist} onChange={(e) => setAddWatchlist(e.target.checked)} />
          Add to watchlist
        </label>
        <label className="spoiler-check">
          <input type="checkbox" checked={addFavorite} onChange={(e) => setAddFavorite(e.target.checked)} />
          Add to favorites
        </label>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : "Save to profile"}
        </button>
      </div>
    </form>
  );
}

export default FeedComposer;
