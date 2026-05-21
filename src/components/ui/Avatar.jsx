function Avatar({ name, src, size = 40 }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";

  if (src) {
    return (
      <img
        className="avatar avatar-img"
        src={src}
        alt={name || "Profile"}
        width={size}
        height={size}
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
