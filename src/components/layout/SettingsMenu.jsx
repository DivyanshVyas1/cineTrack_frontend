import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import { updatePrivacy } from "../../services/userService";

function SettingsMenu() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 8,
      left: Math.max(8, rect.right - 280),
    });
  };

  useEffect(() => {
    if (!open) return undefined;
    updatePosition();
    const onResize = () => updatePosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onClickOutside = (e) => {
      const inTrigger = triggerRef.current?.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (!inTrigger && !inMenu) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const togglePrivacy = async () => {
    setSaving(true);
    try {
      const next = !user.isPrivate;
      const updated = await updatePrivacy(next);
      updateUser(updated);
      toast.success(next ? "Profile is now private" : "Profile is now public");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update privacy"));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  const handleAbout = () => {
    setOpen(false);
    navigate("/about");
  };

  const dropdown = open ? (
    <div
      ref={menuRef}
      className="settings-dropdown-portal glass-card"
      style={{ top: menuPos.top, left: menuPos.left }}
    >
      <p className="settings-title">Settings</p>
      <div className="settings-row">
        <div>
          <strong>Profile visibility</strong>
          <span>{user?.isPrivate ? "Private" : "Public"}</span>
        </div>
        <button type="button" className="toggle-pill" onClick={togglePrivacy} disabled={saving}>
          {user?.isPrivate ? "Switch to Public" : "Switch to Private"}
        </button>
      </div>
      <p className="settings-hint">
        {user?.isPrivate
          ? "Only you can see your collections. Feed posts stay hidden from others."
          : "Your public posts appear in the community feed."}
      </p>
      <div className="settings-divider" />
      <button type="button" className="settings-logout" style={{ background: 'var(--primary-color)', color: 'white', marginBottom: '8px' }} onClick={handleAbout}>
        ℹ️ About CineTrack
      </button>
      <button type="button" className="settings-logout" onClick={handleLogout}>
        Sign out
      </button>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="settings-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label="Settings"
      >
        ⚙
      </button>
      {open ? createPortal(dropdown, document.body) : null}
    </>
  );
}

export default SettingsMenu;
