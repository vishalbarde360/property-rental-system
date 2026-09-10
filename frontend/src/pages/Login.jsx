import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthShell from "../components/AuthShell";

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
    <AuthShell title="Welcome back" subtitle="Sign in to manage your rental journey.">
      <form onSubmit={submit} className="space-y-4">
        {err && <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</div>}
        <label className="label">
          Email
          <input
            className="input mt-1"
            type="email"
            required
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
          />
        </label>
        <label className="label">
          Password
          <input
            className="input mt-1"
            type="password"
            required
            value={f.password}
            onChange={(e) => setF({ ...f, password: e.target.value })}
          />
        </label>
        <button className="btn-primary w-full" type="submit">Sign in</button>
        <div className="relative py-2 text-center text-xs font-semibold tracking-widest text-slate-400">
          <span className="relative z-10 bg-white px-2">OR</span>
          <span className="absolute left-0 right-0 top-1/2 h-px bg-slate-200" />
        </div>
        <button
          type="button"
          className="btn-secondary w-full"
          onClick={() => {
            window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL;
          }}
        >
          Continue with Google
        </button>
        <p className="text-sm text-slate-500">
          <Link className="font-semibold text-navy-700" to="/forgot-password">Forgot password?</Link>
        </p>
        <p className="text-sm text-slate-500">
          New here? <Link className="font-semibold text-navy-700" to="/register">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
}
