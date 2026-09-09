import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
export default function Login({ onLogin }) {
  const [f, setF] = useState({ email: "", password: "" }),
    [err, setErr] = useState("");
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const r = await api.post("/auth/login", f);
      localStorage.setItem("rentnest_token", r.data.token);
      localStorage.setItem("rentnest_user", JSON.stringify(r.data.user));
      onLogin(r.data.user);
      nav("/dashboard");
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    }
  };
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your rental journey."
    >
      <form onSubmit={submit}>
        {err && <div className="error">{err}</div>}
        <label>
          Email
          <input
            type="email"
            required
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            value={f.password}
            onChange={(e) => setF({ ...f, password: e.target.value })}
          />
        </label>
        <button className="primary full">Sign in</button>
        <div className="google-divider">
  <span>OR</span>
</div>

<button
  type="button"
  className="google-btn"
  onClick={() => {
    window.location.href =
      import.meta.env.VITE_GOOGLE_AUTH_URL;
  }}
>
  Continue with Google
</button>
        <p className="switch">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
        <p className="switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
}
function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth-wrap">
      <div className="auth-panel">
        <p className="eyebrow">RENTNEST</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
