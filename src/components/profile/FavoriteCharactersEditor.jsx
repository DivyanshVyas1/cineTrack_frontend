import { useState } from "react";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../api/client";
import { updateFavoriteCharacters } from "../../services/socialService";

function FavoriteCharactersEditor({ initial = [], onSaved }) {
  const [chars, setChars] = useState(
    initial.length
      ? initial
      : [
          { name: "", source: "" },
          { name: "", source: "" },
          { name: "", source: "" },
        ]
  );
  const [saving, setSaving] = useState(false);

  const update = (index, field, value) => {
    setChars((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const save = async (e) => {
    e.preventDefault();
    const filled = chars.filter((c) => c.name.trim());
    if (filled.length > 3) {
      toast.error("Maximum 3 characters");
      return;
    }
    setSaving(true);
    try {
      const user = await updateFavoriteCharacters(filled);
      onSaved?.(user.favoriteCharacters);
      toast.success("Favorite characters saved");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="glass-card panel characters-editor" onSubmit={save}>
      <h4>Favorite fictional characters (max 3)</h4>
      <p className="sidebar-muted">Characters you love most from movies, shows, or books.</p>
      {chars.map((c, i) => (
        <div key={i} className="character-input-row">
          <input
            placeholder="Character name"
            value={c.name}
            onChange={(e) => update(i, "name", e.target.value)}
          />
          <input
            placeholder="From (e.g. Breaking Bad)"
            value={c.source}
            onChange={(e) => update(i, "source", e.target.value)}
          />
        </div>
      ))}
      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? "Saving..." : "Save characters"}
      </button>
    </form>
  );
}

export default FavoriteCharactersEditor;
