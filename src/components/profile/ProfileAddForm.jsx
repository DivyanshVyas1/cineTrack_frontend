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
  const [rating, setRating] = useState(8);
  const [note, setNote] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [markFavorite, setMarkFavorite] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMediaType(defaultMediaType);
    setSelection(null);
  }, [defaultMediaType]);

  const isWatchlist = mode === "watchlist";
  const isMusic = mediaType === "music";

  const mapListType = (type) => {
    if (type === "series") return "show";
    return type;
  };

  const buildPostPayload = (item) => ({
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
    rating: Number(rating),
    note,
    isSpoiler: isMusic ? false : isSpoiler,
    visibility: "public",
  });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let movieId = existingMovie?._id;

      if (!movieId && isWatchlist) {
        if (!selection?.title?.trim()) {
          toast.error("Search and select a title from suggestions");
          setSubmitting(false);
          return;
        }
        const created = await createMovie({
          title: selection.title,
          type: mapListType(selection.type || mediaType),
          overview: selection.artistName || selection.overview || "",
          poster: selection.poster || "",
          genres: isMusic ? [] : selection.genres || [],
          releaseDate: selection.releaseDate || undefined,
        });
        movieId = created._id;
        await addToList(movieId, "watchlist");
        toast.success("Added to watchlist");
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
          })
        );
        if (markFavorite) {
          await addToList(existingMovie._id, "favorite");
        }
        toast.success(markFavorite ? "Posted and added to favourites" : "Review published");
      } else if (!movieId) {
        if (!selection?.title?.trim()) {
          toast.error("Search and select a title from suggestions");
          setSubmitting(false);
          return;
        }
        await createPost(buildPostPayload(selection));
        if (markFavorite && !isMusic) {
          const fav = await createMovie({
            title: selection.title,
            type: mapListType(selection.type || mediaType),
            poster: selection.poster || "",
            genres: selection.genres || [],
          });
          await addToList(fav._id, "favorite");
        }
        toast.success(markFavorite ? "Posted and added to favorites" : "Post published");
      }

      setSelection(null);
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
        <TitleSearchField mediaType={mediaType} onSelect={setSelection} disabled={submitting} />
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

      <button type="submit" className="btn-primary" disabled={submitting || (!existingMovie && !selection)}>
        {submitting ? "Saving..." : isWatchlist ? "Add to watchlist" : "Publish post"}
      </button>
    </form>
  );
}

export default ProfileAddForm;
