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

  return (
    <div className="app-shell">
      <header className="navbar glass-card">
        <Link to="/" className="brand-link">
          <img src="/logo.png" alt="CineTrack Logo" className="brand-logo" />
          <h1>CineTrack</h1>
        </Link>

        <nav className="navbar-main">
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"}>
              {item.label}
            </NavLink>
          ))}
          {isAdmin ? <NavLink to="/admin">Admin</NavLink> : null}
        </nav>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <>
              <NavLink
                to={`/profile/${user.username}`}
                className={({ isActive }) =>
                  `navbar-user-link${isActive ? " navbar-user-link-active" : ""}`
                }
              >
                {user?.name}
                {isAdmin ? <span className="role-badge">Admin</span> : null}
              </NavLink>
              <SettingsMenu />
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
    </div>
  );
}

export default MainLayout;
