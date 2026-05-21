function Badge({ children, variant = "pink" }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

export default Badge;
