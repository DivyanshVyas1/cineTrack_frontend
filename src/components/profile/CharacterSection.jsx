function CharacterSection({ label, characters = [], variant = "favorite" }) {
  if (!characters.length) return null;

  return (
    <section
      className={`profile-block profile-characters-block profile-characters-${variant}`}
      aria-label={label}
    >
      <h4 className="profile-block-label profile-characters-heading">{label}</h4>
      <div className="character-chips-grid">
        {characters.map((c, i) => (
          <div key={`${c.name}-${i}`} className={`character-chip character-chip-${variant}`}>
            <span className="character-chip-name" title={c.name}>
              {c.name}
            </span>
            {c.source ? (
              <span className="character-chip-source" title={c.source}>
                {c.source}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default CharacterSection;
