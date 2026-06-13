import { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import SettingsMenu from "../components/layout/SettingsMenu";
import { useAuth } from "../hooks/useAuth";

const links = [
  { to: "/", label: "Feed" },
  { to: "/discover", label: "Discover" },
  { to: "/post", label: "Post" },
];

function MainLayout() {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="app-shell">
      <header className="navbar glass-card">
        <Link to="/" className="brand-link" style={isMobile ? { order: 1, flexShrink: 0 } : undefined}>
          <img src="/logo.png" alt="CineTrack Logo" className="brand-logo" />
          <h1>CineTrack</h1>
        </Link>

        <nav className="navbar-main" style={isMobile ? { order: 3, width: "100%", justifyContent: "space-around", paddingTop: "0.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", overflowX: "auto", flexWrap: "nowrap", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" } : undefined}>
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"}>
              {item.label}
            </NavLink>
          ))}
          {isAdmin ? <NavLink to="/admin">Admin</NavLink> : null}
        </nav>

        <div className="navbar-auth" style={isMobile ? { order: 2, width: "auto", justifyContent: "flex-end", display: "flex", flexWrap: "nowrap", alignItems: "center", gap: "0.5rem" } : { display: "flex", flexWrap: "nowrap", alignItems: "center", gap: "0.5rem" }}>
          {isAuthenticated ? (
            <>
              <NavLink
                to={`/profile/${user.username}`}
                className={({ isActive }) =>
                  `navbar-user-link${isActive ? " navbar-user-link-active" : ""}`
                }
                style={{ flexShrink: 1, minWidth: 0, display: "flex", alignItems: "center" }}
              >
                <span style={{ 
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "80px",
                  display: "inline-block"
                }} title={user?.name}>
                  {user?.name?.split(" ")[0]}
                </span>
                {isAdmin ? <span className="role-badge">Admin</span> : null}
              </NavLink>
              <div style={{ flexShrink: 0 }}>
                <SettingsMenu />
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="app-footer glass-card">
        <div className="footer-content">
          <p>
            <a href="mailto:peepal.team@gmail.com" style={{ color: "#fff", textDecoration: "none" }}>peepal.team@gmail.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
