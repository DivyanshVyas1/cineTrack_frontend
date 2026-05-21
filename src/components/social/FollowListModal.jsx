import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../api/client";
import { fetchFollowers, fetchFollowing } from "../../services/socialService";
import Avatar from "../ui/Avatar";

const TITLES = {
  followers: "Followers",
  following: "Following",
};

function FollowListModal({ username, type, open, onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !username || !type) return;
    const load = async () => {
      setLoading(true);
      try {
        const data =
          type === "followers" ? await fetchFollowers(username) : await fetchFollowing(username);
        setUsers(data);
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Failed to load users"));
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, username, type]);

  const title = TITLES[type] || "Users";

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
            className="glass-card likes-modal follow-list-modal"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="likes-modal-header">
              <h3>{title}</h3>
              <button type="button" className="btn-ghost" onClick={onClose}>
                ✕
              </button>
            </div>
            {loading ? <p className="sidebar-muted">Loading...</p> : null}
            {!loading && users.length === 0 ? (
              <p className="sidebar-muted">No {title.toLowerCase()} yet.</p>
            ) : null}
            <ul className="likes-list">
              {users.map((u) => (
                <li key={u._id}>
                  <Link to={`/profile/${u.username}`} onClick={onClose}>
                    <Avatar name={u.name} src={u.avatar} size={36} />
                    <div className="follow-list-user">
                      <span>{u.name}</span>
                      <em>@{u.username}</em>
                    </div>
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

export default FollowListModal;
