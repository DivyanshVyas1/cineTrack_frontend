import { motion } from "framer-motion";

function CharacterSection({ label, characters = [], variant = "favorite" }) {
  if (!characters.length) return null;

  const isFav = variant === "favorite";
  const accentColor = isFav ? "#4ade80" : "#f87171";
  const bgColor     = isFav ? "rgba(74,222,128,0.1)"  : "rgba(248,113,113,0.1)";
  const borderColor = isFav ? "rgba(74,222,128,0.28)" : "rgba(248,113,113,0.28)";
  const emoji       = isFav ? "⭐" : "💔";

  return (
    <section
      className={`profile-block profile-characters-block profile-characters-${variant}`}
      aria-label={label}
      style={{ paddingTop: 0, borderTop: "none" }}
    >
      {/* NO class="character-chips-grid" — avoids the CSS grid that causes overlap */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.55rem",
          padding: "0.75rem 1rem 1rem",
          alignItems: "flex-start",
        }}
      >
        {characters.map((c, i) => (
          <motion.span
            key={`${c.name}-${i}`}
            // Only Y-axis float — stays in flex flow, never overlaps neighbours
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 3 + (i % 4) * 0.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.28rem",
              padding: "0.3rem 0.8rem",
              borderRadius: "999px",
              background: bgColor,
              border: `1px solid ${borderColor}`,
              color: accentColor,
              fontSize: "0.8rem",
              fontWeight: "700",
              letterSpacing: "0.01em",
              cursor: "default",
              whiteSpace: "nowrap",
              flexShrink: 0,
              userSelect: "none",
              // Override any CSS that might interfere
              width: "auto",
              minWidth: 0,
              maxWidth: "none",
              flexDirection: "row",
              position: "static",
            }}
          >
            <span style={{ fontSize: "0.72rem", lineHeight: 1 }}>{emoji}</span>
            {c.name}
          </motion.span>
        ))}
      </div>
    </section>
  );
}

export default CharacterSection;
