import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../api/client";
import TitleSearchField from "../post/TitleSearchField";
import { createMovie } from "../../services/movieService";
import { createPost } from "../../services/postService";
import { addToList } from "../../services/userService";
import RatingSlider from "../ui/RatingSlider";

function ProfileAddForm({
  defaultMediaType = "movie",
  heading,
  mode = "log",
  onPosted,
  existingMovie = null,
}) {
  const [mediaType, setMediaType] = useState(defaultMediaType);
  const [selection, setSelection] = useState(null);
  const [addedItems, setAddedItems] = useState([]);
  const [searchKey, setSearchKey] = useState(0);
  const [rating, setRating] = useState(8);
  const [note, setNote] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [markFavorite, setMarkFavorite] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMediaType(defaultMediaType);
    setSelection(null);
    setAddedItems([]);
    setSearchKey((k) => k + 1);
  }, [defaultMediaType]);

  const isWatchlist = mode === "watchlist";
  const isMusic = mediaType === "music";

  const mapListType = (type) => {
    if (type === "series") return "show";
    return type;
  };

  const buildPostPayload = (item, r, n, s) => ({
    type: item.type || mediaType,
    title: item.title,
    externalId: item.externalId || "",
    genres: isMusic ? [] : item.genres || [],
    poster: item.poster || "",
    artistName: item.artistName || item.artist || "",
    previewUrl: item.previewUrl || "",
    youtubeVideoId: item.videoId || item.youtubeVideoId || item.externalId || "",
    youtubeUrl: item.youtubeUrl || "",
    duration: Number(item.duration) || 0,
    rating: Number(r),
    note: n,
    isSpoiler: isMusic ? false : s,
    visibility: "public",
  });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let movieId = existingMovie?._id;

      const itemsToSubmit = [...addedItems];
      if (selection) itemsToSubmit.push({ selection, rating, note, isSpoiler, markFavorite });

      if (!movieId && isWatchlist) {
        if (itemsToSubmit.length === 0) {
          toast.error("Search and select a title from suggestions");
          setSubmitting(false);
          return;
        }
        for (const itemObj of itemsToSubmit) {
          const item = itemObj.selection;
          const created = await createMovie({
            title: item.title,
            type: mapListType(item.type || mediaType),
            overview: item.artistName || item.overview || "",
            poster: item.poster || "",
            genres: isMusic ? [] : item.genres || [],
            releaseDate: item.releaseDate || undefined,
          });
          await addToList(created._id, "watchlist");
        }
        toast.success(itemsToSubmit.length > 1 ? `Added ${itemsToSubmit.length} items to watchlist` : "Added to watchlist");
      } else if (existingMovie) {
        const postType =
          existingMovie.type === "show" ? "series" : existingMovie.type === "series" ? "series" : existingMovie.type;
        await createPost(
          buildPostPayload({
            type: postType,
            title: existingMovie.title,
            externalId: existingMovie.externalId || "",
            genres: existingMovie.genres || [],
            poster: existingMovie.poster || "",
            artistName: existingMovie.artistName || existingMovie.overview || "",
            duration: existingMovie.duration || 0,
            previewUrl: existingMovie.previewUrl || "",
            youtubeVideoId: existingMovie.youtubeVideoId || existingMovie.externalId || "",
          }, rating, note, isSpoiler)
        );
        if (markFavorite) {
          await addToList(existingMovie._id, "favorite");
        }
        toast.success(markFavorite ? "Posted and added to favourites" : "Review published");
      } else if (!movieId) {
        if (itemsToSubmit.length === 0) {
          toast.error("Search and select a title from suggestions");
          setSubmitting(false);
          return;
        }
        for (const itemObj of itemsToSubmit) {
          const item = itemObj.selection;
          await createPost(buildPostPayload(item, itemObj.rating, itemObj.note, itemObj.isSpoiler));
          if (itemObj.markFavorite && !isMusic) {
            const fav = await createMovie({
              title: item.title,
              type: mapListType(item.type || mediaType),
              poster: item.poster || "",
              genres: item.genres || [],
            });
            await addToList(fav._id, "favorite");
          }
        }
        toast.success(
          markFavorite
            ? itemsToSubmit.length > 1
              ? `Posted and added ${itemsToSubmit.length} items to favorites`
              : "Posted and added to favorites"
            : itemsToSubmit.length > 1
              ? `Published ${itemsToSubmit.length} posts`
              : "Post published"
        );
      }

      setSelection(null);
      setAddedItems([]);
      setSearchKey((k) => k + 1);
      setNote("");
      setRating(8);
      setIsSpoiler(false);
      setMarkFavorite(false);
      onPosted?.();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="glass-card feed-composer" onSubmit={submit}>
      <h3>{heading}</h3>

      {existingMovie ? (
        <p className="composer-selected">Reviewing: {existingMovie.title}</p>
      ) : (
        <>
          {addedItems.length > 0 && (
            <div className="added-items-list" style={{ marginBottom: "1rem" }}>
              {addedItems.map((itemObj, idx) => (
                <div
                  key={idx}
                  className="composer-selected"
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}
                >
                  <span>{itemObj.selection.title} {!isWatchlist && mode === "log" ? `(★ ${itemObj.rating})` : ""}</span>
                  <button
                    type="button"
                    onClick={() => setAddedItems((prev) => prev.filter((_, i) => i !== idx))}
                    className="btn-ghost"
                    style={{ fontSize: "0.8rem", padding: "0.2rem 0.5rem" }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          <TitleSearchField 
            key={searchKey} 
            mediaType={mediaType} 
            onSelect={setSelection} 
            disabled={submitting} 
            required={addedItems.length === 0} 
          />
        </>
      )}

      {!isWatchlist && mode === "log" ? (
        <>
          <RatingSlider value={rating} onChange={setRating} />
          <textarea
            placeholder="Your notes (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
          <div className="composer-checks">
            {!isMusic ? (
              <label className="spoiler-check">
                <input type="checkbox" checked={isSpoiler} onChange={(e) => setIsSpoiler(e.target.checked)} />
                Spoilers
              </label>
            ) : null}
            {!isMusic ? (
              <label className="spoiler-check favourite-check">
                <input
                  type="checkbox"
                  checked={markFavorite}
                  onChange={(e) => setMarkFavorite(e.target.checked)}
                />
                Favourite
              </label>
            ) : null}
          </div>
        </>
      ) : null}

      <div style={{ display: "flex", gap: "1rem" }}>
        {selection && !existingMovie && (
          <button
            type="button"
            className="btn-ghost"
            style={{ flex: 1 }}
            onClick={() => {
              setAddedItems((prev) => [...prev, { selection, rating, note, isSpoiler, markFavorite }]);
              setSelection(null);
              setSearchKey((k) => k + 1);
              setNote("");
              setRating(8);
              setIsSpoiler(false);
              setMarkFavorite(false);
            }}
          >
            + Add another {defaultMediaType === "series" ? "show" : defaultMediaType}
          </button>
        )}
        <button
          type="submit"
          className="btn-primary"
          style={{ flex: 1 }}
          disabled={submitting || (!existingMovie && !selection && addedItems.length === 0)}
        >
          {submitting ? "Saving..." : isWatchlist ? "Add to watchlist" : "Publish post"}
        </button>
      </div>
    </form>
  );
}

export default ProfileAddForm;
