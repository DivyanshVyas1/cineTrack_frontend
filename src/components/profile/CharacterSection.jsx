function CharacterSection({ label, characters = [], variant = "favorite" }) {
  if (!characters.length) return null;

  return (
    <section
      className={`profile-block profile-characters-block profile-characters-${variant}`}
      aria-label={label}
    >
      <h4 className="profile-block-label profile-characters-heading">{label}</h4>
      <div className="character-chips-grid" style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
        {characters.map((c, i) => (
          <div key={`${c.name}-${i}`} className={`character-chip character-chip-${variant}`} style={{ width: "auto", flex: "0 0 auto", margin: 0, display: "inline-flex", alignItems: "center", padding: "0.4rem 0.8rem", borderRadius: "8px" }}>
            <span className="character-chip-name" title={c.name} style={{ margin: 0, lineHeight: 1 }}>
              {c.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CharacterSection;
