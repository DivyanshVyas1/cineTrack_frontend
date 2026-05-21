import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../api/client";
import { loginUser } from "../services/authService";

const toastError = (message) => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  });
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await loginUser(form);
      login(result);
      toast.success("Welcome back to CineTrack");
      const from = location.state?.from;
      navigate(from || (result.user?.role === "admin" ? "/admin" : "/"));
    } catch (err) {
      const message = getApiErrorMessage(err, "Login failed. Please try again.");
      toastError(message);
      setError(message);
    }
  };

  return (
    <section className="auth-page">
      <form className="glass-card auth-card" onSubmit={submit}>
        <h2>Sign in to CineTrack</h2>
        <p className="auth-subtitle">Sign in with your CineTrack account.</p>

        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error ? <p className="error-text">{error}</p> : null}

        <button type="submit">Sign in</button>

        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
}

export default LoginPage;
