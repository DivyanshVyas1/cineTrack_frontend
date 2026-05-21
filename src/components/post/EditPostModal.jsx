import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../api/client";
import { updatePost, togglePostFavorite } from "../../services/postService";
import RatingSlider from "../ui/RatingSlider";

function EditPostModal({ post, open, onClose, onSaved, onFavoriteChange }) {
  const [rating, setRating] = useState(8);
  const [note, setNote] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [visibility, setVisibility] = useState("public");
  const [markFavorite, setMarkFavorite] = useState(false);
  const [initialFavorite, setInitialFavorite] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !post) return;
    setRating(post.rating ?? 8);
    setNote(post.note || "");
    setIsSpoiler(Boolean(post.isSpoiler));
    setVisibility(post.visibility || "public");
    const fav = Boolean(post.isFavorite);
    setMarkFavorite(fav);
    setInitialFavorite(fav);
  }, [open, post?._id, post?.isFavorite, post?.rating, post?.note, post?.isSpoiler, post?.visibility]);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePost(post._id, {
        rating: Number(rating),
        note,
        isSpoiler,
        visibility,
      });
      if (markFavorite !== initialFavorite) {
        const result = await togglePostFavorite(post._id);
        onFavoriteChange?.(result.isFavorite);
      }
      toast.success("Post updated");
      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update post"));
    } finally {
      setSaving(false);
    }
  };

  const title = post?.title || post?.movie?.title;

  return createPortal(
    <AnimatePresence>
      {open && post ? (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.form
            className="glass-card edit-post-modal"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={save}
          >
            <div className="edit-profile-header">
              <h3>Edit post</h3>
              <button type="button" className="btn-ghost" onClick={onClose}>
                ✕
              </button>
            </div>
            <p className="composer-selected">Editing: {title}</p>
            <RatingSlider value={rating} onChange={setRating} />
            <textarea
              rows={3}
              placeholder="Your notes"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="composer-checks">
              <label className="spoiler-check">
                <input type="checkbox" checked={isSpoiler} onChange={(e) => setIsSpoiler(e.target.checked)} />
                Spoilers
              </label>
              <label className="spoiler-check favourite-check">
                <input
                  type="checkbox"
                  checked={markFavorite}
                  onChange={(e) => setMarkFavorite(e.target.checked)}
                />
                Favourite
              </label>
            </div>
            <label className="edit-field">
              <span>Visibility</span>
              <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                <option value="public">Public (shows in feed)</option>
                <option value="private">Private (profile only)</option>
              </select>
            </label>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export default EditPostModal;
