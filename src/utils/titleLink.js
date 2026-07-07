export const normalizeTitleType = (type) => {
  if (type === "show" || type === "web-shows") return "series";
  if (type === "series") return "series";
  return type || "movie";
};

export const buildTitleLink = (item) => {
  const type = normalizeTitleType(item?.type || item?.movie?.type || item?.postType);
  const title = item?.title || item?.movie?.title;
  const externalId = item?.externalId || item?.movie?.externalId || "";

  if (!title?.trim()) return "/";

  const params = new URLSearchParams();
  params.set("type", type);
  params.set("title", title.trim());
  if (externalId) params.set("externalId", String(externalId));

  return `/title?${params.toString()}`;
};

export const formatDuration = (seconds) => {
  const s = Number(seconds);
  if (!s || s < 1) return "";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
};
