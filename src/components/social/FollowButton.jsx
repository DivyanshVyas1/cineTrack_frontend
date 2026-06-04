import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { getApiErrorMessage } from "../../api/client";

import { useAuth } from "../../hooks/useAuth";

import { followUser, unfollowUser, cancelFollowRequest } from "../../services/socialService";



function FollowButton({
  username,
  initialFollowing = false,
  initialRequestPending = false,
  isPrivateTarget = false,
  onChange,
  compact = false,
  style,
  className,
}) {

  const { isAuthenticated, user } = useAuth();

  const [following, setFollowing] = useState(initialFollowing);

  const [requestPending, setRequestPending] = useState(initialRequestPending);

  const [loading, setLoading] = useState(false);



  useEffect(() => {

    setFollowing(initialFollowing);

    setRequestPending(initialRequestPending);

  }, [initialFollowing, initialRequestPending]);



  if (!isAuthenticated || user?.username === username) return null;



  const toggle = async () => {

    setLoading(true);

    try {

      if (following) {

        await unfollowUser(username);

        setFollowing(false);

        setRequestPending(false);

        onChange?.({ following: false, requestPending: false });

        toast.success("Unfollowed");

      } else if (requestPending) {

        await cancelFollowRequest(username);

        setRequestPending(false);

        onChange?.({ following: false, requestPending: false });

        toast.info("Request cancelled");

      } else {

        const result = await followUser(username);

        if (result.requestPending) {

          setRequestPending(true);

          onChange?.({ following: false, requestPending: true });

          toast.success("Follow request sent");

        } else {

          setFollowing(true);

          onChange?.({ following: true, requestPending: false });

          toast.success("Following");

        }

      }

    } catch (err) {

      toast.error(getApiErrorMessage(err, "Action failed"));

    } finally {

      setLoading(false);

    }

  };



  let label = "Follow";

  let btnClass = "btn-primary follow-btn";

  if (following) {

    label = compact ? "Following" : "Unfollow";

    btnClass = "btn-ghost follow-btn";

  } else if (requestPending) {

    label = compact ? "Requested" : "Cancel request";

    btnClass = "btn-ghost follow-btn";

  } else if (isPrivateTarget) {

    label = compact ? "Request" : "Request to follow";

  }



  return (

    <button type="button" className={`${btnClass} ${className || ""}`.trim()} style={style} onClick={toggle} disabled={loading}>

      {loading ? "..." : label}

    </button>

  );

}



export default FollowButton;

