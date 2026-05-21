import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../api/client";
import Avatar from "../ui/Avatar";
import {
  acceptFollowRequest,
  fetchFollowRequests,
  rejectFollowRequest,
} from "../../services/socialService";

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, x: -8, transition: { duration: 0.18 } },
};

function ProfileRequestsPanel({ onChanged }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFollowRequests();
      setRequests(data);
      onChanged?.(data.length);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to load requests"));
    } finally {
      setLoading(false);
    }
  }, [onChanged]);

  useEffect(() => {
    load();
  }, [load]);

  const respond = async (id, accept) => {
    try {
      if (accept) await acceptFollowRequest(id);
      else await rejectFollowRequest(id);
      toast.success(accept ? "Request accepted" : "Request declined");
      setRequests((prev) => prev.filter((r) => r._id !== id));
      onChanged?.(requests.length - 1);
      load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Action failed"));
    }
  };

  if (loading) {
    return (
      <motion.p className="sidebar-muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Loading requests…
      </motion.p>
    );
  }

  if (!requests.length) {
    return (
      <motion.p
        className="sidebar-muted follow-requests-empty"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        No pending follow requests.
      </motion.p>
    );
  }

  return (
    <motion.ul
      className="follow-requests-list"
      variants={listVariants}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence mode="popLayout">
        {requests.map((req) => (
          <motion.li
            key={req._id}
            className="follow-request-card follow-request-card-embedded"
            variants={itemVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            layout
          >
            <Link to={`/profile/${req.requester?.username}`} className="follow-request-user">
              <Avatar name={req.requester?.name} src={req.requester?.avatar} size={44} />
              <div className="follow-request-identity">
                <span className="follow-request-name">{req.requester?.name}</span>
                <span className="follow-request-handle">@{req.requester?.username}</span>
              </div>
            </Link>
            <div className="follow-request-actions">
              <button type="button" className="btn-primary btn-sm" onClick={() => respond(req._id, true)}>
                Accept
              </button>
              <button type="button" className="btn-ghost btn-sm" onClick={() => respond(req._id, false)}>
                Decline
              </button>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}

export default ProfileRequestsPanel;
