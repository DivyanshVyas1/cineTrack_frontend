import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../api/client";
import { registerUser } from "../services/authService";

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

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await registerUser(form);
      login(result);
      toast.success("Account created — welcome to CineTrack");
      navigate("/");
    } catch (err) {
      const message = getApiErrorMessage(err, "Registration failed");
      toastError(message);
      setError(message);
    }
  };

  return (
    <section className="auth-page">
      <form className="glass-card auth-card" onSubmit={submit}>
        <h2>Create your CineTrack account</h2>
        <p className="auth-subtitle">Join the community and start your movie diary.</p>

        <input required placeholder="Full name" value={form.name} onChange={update("name")} />
        <input required placeholder="Username (e.g. arivera_cine)" value={form.username} onChange={update("username")} />
        <input required type="email" placeholder="Email" value={form.email} onChange={update("email")} />
        <input
          required
          type="password"
          minLength={6}
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={update("password")}
        />

        {error ? <p className="error-text">{error}</p> : null}

        <button type="submit">Create account</button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </section>
  );
}

export default RegisterPage;
