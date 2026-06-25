function Avatar({ name, src, size = 40 }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";

  if (src) {
    const imageSrc = src ? (src + (src.includes("?") ? "&" : "?") + "cors=1") : "";
    return (
      <img
        className="avatar avatar-img"
        src={imageSrc}
        alt={name || "Profile"}
        width={size}
        height={size}
        crossOrigin="anonymous"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {initial}
    </div>
  );
}

export default Avatar;
