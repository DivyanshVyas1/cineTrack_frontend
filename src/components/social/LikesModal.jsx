import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchLikes } from "../../services/socialService";
import Avatar from "../ui/Avatar";

function LikesModal({ reviewId, open, onClose }) {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !reviewId) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchLikes(reviewId);
        setLikes(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, reviewId]);

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-card likes-modal"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="likes-modal-header">
              <h3>Liked by</h3>
              <button type="button" className="btn-ghost" onClick={onClose}>
                ✕
              </button>
            </div>
            {loading ? <p className="sidebar-muted">Loading...</p> : null}
            {!loading && likes.length === 0 ? <p className="sidebar-muted">No likes yet.</p> : null}
            <ul className="likes-list">
              {likes.map((like) => (
                <li key={like._id}>
                  <Link to={`/profile/${like.user?.username}`} onClick={onClose}>
                    <Avatar name={like.user?.name} src={like.user?.avatar} size={32} />
                    <span>{like.user?.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export default LikesModal;
