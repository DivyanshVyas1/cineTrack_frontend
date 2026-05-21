import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchUsers } from "../../services/searchService";
import Avatar from "../ui/Avatar";

function UserSearch() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setUsers([]);
      return undefined;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchUsers(q);
        setUsers(data);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <section className="glass-card panel discover-search">
      <h4>Find users</h4>
      <input
        type="search"
        className="discover-search-input"
        placeholder="Search by username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading ? <p className="sidebar-muted">Searching...</p> : null}
      {!loading && query.trim() && users.length === 0 ? (
        <p className="sidebar-muted">No users found for @{query.trim()}</p>
      ) : null}
      {users.length > 0 ? (
        <ul className="user-search-results">
          {users.map((u) => (
            <li key={u._id}>
              <Link to={`/profile/${u.username}`} className="user-search-item">
                <Avatar name={u.name} src={u.avatar} size={40} />
                <div>
                  <strong>{u.name}</strong>
                  <span>@{u.username}</span>
                  {u.bio ? <em>{u.bio}</em> : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default UserSearch;
