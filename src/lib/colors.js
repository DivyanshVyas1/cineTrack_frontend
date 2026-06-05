export const getGenreColor = (genre) => {
  if (!genre) return { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.15)", color: "var(--text-secondary)" };
  
  const colors = [
    { bg: "rgba(255, 77, 157, 0.15)", border: "rgba(255, 77, 157, 0.3)", color: "#ff4d9d" }, // Pink
    { bg: "rgba(0, 204, 255, 0.15)", border: "rgba(0, 204, 255, 0.3)", color: "#00ccff" }, // Blue
    { bg: "rgba(57, 255, 20, 0.15)", border: "rgba(57, 255, 20, 0.3)", color: "#39ff14" }, // Green
    { bg: "rgba(255, 238, 50, 0.15)", border: "rgba(255, 238, 50, 0.3)", color: "#ffee32" }, // Amber
    { bg: "rgba(110, 231, 183, 0.15)", border: "rgba(110, 231, 183, 0.3)", color: "#6ee7b7" }, // Mint
    { bg: "rgba(56, 189, 248, 0.15)", border: "rgba(56, 189, 248, 0.3)", color: "#38bdf8" }, // Cyan
    { bg: "rgba(251, 113, 133, 0.15)", border: "rgba(251, 113, 133, 0.3)", color: "#fb7185" }, // Rose
    { bg: "rgba(20, 184, 166, 0.15)", border: "rgba(20, 184, 166, 0.3)", color: "#14b8a6" }  // Teal
  ];
  
  let hash = 0;
  for (let i = 0; i < genre.length; i++) {
    hash = genre.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};
