import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../api/client";
import { updateMyProfile } from "../../services/userService";
import CharacterSearchField from "../search/CharacterSearchField";
import Avatar from "../ui/Avatar";

const EMPTY_CHARS = [
  { name: "", source: "" },
  { name: "", source: "" },
  { name: "", source: "" },
];

function padCharacters(chars = []) {
  const filled = chars.filter((c) => c.name?.trim()).slice(0, 3);
  while (filled.length < 3) filled.push({ name: "", source: "" });
  return filled;
}

function EditProfileModal({ open, onClose, profile, onSaved }) {
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [chars, setChars] = useState(EMPTY_CHARS);
  const [gandu, setGandu] = useState(EMPTY_CHARS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !profile) return;
    setBio(profile.bio || "");
    setAvatar(profile.avatar || "");
    setChars(padCharacters(profile.favoriteCharacters));
    setGandu(padCharacters(profile.ganduCharacters));
  }, [open, profile]);

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const updateChar = (index, value) => {
    setChars((prev) => prev.map((c, i) => (i === index ? { ...value } : c)));
  };

  const updateGandu = (index, value) => {
    setGandu((prev) => prev.map((c, i) => (i === index ? { ...value } : c)));
  };

  const onAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 400_000) {
      toast.error("Image must be under 400KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const user = await updateMyProfile({
        bio: bio.trim(),
        avatar,
        characters: chars.filter((c) => c.name.trim()),
        ganduCharacters: gandu.filter((c) => c.name.trim()),
      });
      toast.success("Profile updated");
      onSaved?.(user);
      onClose();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update profile"));
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.form
            className="glass-card edit-profile-modal"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={save}
          >
            <div className="edit-profile-header">
              <h3>Edit profile</h3>
              <button type="button" className="btn-ghost" onClick={onClose}>
                ✕
              </button>
            </div>

            <div className="edit-avatar-row">
              <Avatar name={profile?.name} src={avatar} size={72} />
              <div className="edit-avatar-actions">
                <label className="btn-ghost edit-upload-btn">
                  Upload photo
                  <input type="file" accept="image/*" hidden onChange={onAvatarPick} />
                </label>
                {avatar ? (
                  <button type="button" className="btn-ghost" onClick={() => setAvatar("")}>
                    Remove
                  </button>
                ) : null}
              </div>
            </div>

            <label className="edit-field">
              <span>Bio</span>
              <textarea
                rows={3}
                maxLength={280}
                placeholder="Tell others about your taste..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <em className="edit-char-count">{bio.length}/280</em>
            </label>

            <section className="edit-characters-group edit-characters-favorite">
              <h4 className="edit-characters-heading">Favorite fictional characters</h4>
              <div className="edit-character-slots">
                {chars.map((c, i) => (
                  <div key={`fav-${i}`} className="edit-character-slot">
                    <span className="edit-character-slot-num">{i + 1}</span>
                    <CharacterSearchField
                      compact
                      value={c}
                      onChange={(val) => updateChar(i, val)}
                      placeholder={`Search character ${i + 1}...`}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="edit-characters-group edit-characters-gandu">
              <h4 className="edit-characters-heading">Most disgusting characters</h4>
              <div className="edit-character-slots">
                {gandu.map((c, i) => (
                  <div key={`gandu-${i}`} className="edit-character-slot">
                    <span className="edit-character-slot-num">{i + 1}</span>
                    <CharacterSearchField
                      compact
                      value={c}
                      onChange={(val) => updateGandu(i, val)}
                      placeholder={`Search character ${i + 1}...`}
                    />
                  </div>
                ))}
              </div>
            </section>

            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save profile"}
            </button>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export default EditProfileModal;
