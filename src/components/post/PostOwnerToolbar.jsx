import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../api/client";
import { deletePost, togglePostFavorite } from "../../services/postService";
import EditPostModal from "./EditPostModal";
import Badge from "../ui/Badge";

function PostOwnerToolbar({ post, onChanged, showRating = false, menuOnly = false }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(Boolean(post.isFavorite));
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    setIsFavorite(Boolean(post.isFavorite));
  }, [post._id, post.isFavorite]);

  const title = post.title || post.movie?.title;

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 6,
      left: Math.max(8, rect.right - 168),
    });
  };

  useEffect(() => {
    if (!menuOpen) return undefined;
    updatePosition();
    const onResize = () => updatePosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onClickOutside = (e) => {
      const inTrigger = triggerRef.current?.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (!inTrigger && !inMenu) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleDelete = async () => {
    closeMenu();
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deletePost(post._id);
      toast.success("Post deleted");
      onChanged?.();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete post"));
    } finally {
      setDeleting(false);
    }
  };

  const handleFavorite = async () => {
    setFavLoading(true);
    try {
      const result = await togglePostFavorite(post._id);
      setIsFavorite(result.isFavorite);
      toast.success(result.isFavorite ? "Added to favourites" : "Removed from favourites");
      onChanged?.();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update favourite"));
    } finally {
      setFavLoading(false);
    }
  };

  const menu = menuOpen
    ? createPortal(
        <div
          ref={menuRef}
          className="post-menu-dropdown glass-card"
          style={{ top: menuPos.top, left: menuPos.left }}
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            className={`post-menu-item ${isFavorite ? "post-menu-item-active" : ""}`}
            onClick={() => {
              closeMenu();
              handleFavorite();
            }}
            disabled={favLoading}
          >
            {favLoading ? "…" : isFavorite ? "★ Favourited" : "☆ Favourite"}
          </button>
          <button
            type="button"
            role="menuitem"
            className="post-menu-item"
            onClick={() => {
              closeMenu();
              setEditOpen(true);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            role="menuitem"
            className="post-menu-item post-menu-item-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "…" : "Delete"}
          </button>
        </div>,
        document.body
      )
    : null;

  const menuButton = (
    <button
      ref={triggerRef}
      type="button"
      className="post-menu-trigger"
      aria-label="Post options"
      aria-expanded={menuOpen}
      aria-haspopup="menu"
      onClick={() => setMenuOpen((v) => !v)}
    >
      ⋮
    </button>
  );

  const editModal = (
    <EditPostModal
      post={{ ...post, isFavorite }}
      open={editOpen}
      onClose={() => setEditOpen(false)}
      onSaved={onChanged}
      onFavoriteChange={setIsFavorite}
    />
  );

  if (menuOnly) {
    return (
      <>
        {menuButton}
        {menu}
        {editModal}
      </>
    );
  }

  return (
    <>
      <div className="post-card-toolbar">
        {showRating ? <Badge variant="blue">{post.rating}/10</Badge> : <span />}
        {menuButton}
      </div>
      {menu}
      {editModal}
    </>
  );
}

export default PostOwnerToolbar;
