import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthShell from "../components/AuthShell";

export default function Register({ onLogin }) {
  const [f, setF] = useState({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "tenant",
    }),
    [err, setErr] = useState("");
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await api.post("/auth/register", f);
      localStorage.setItem("rentnest_token", r.data.token);
      localStorage.setItem("rentnest_user", JSON.stringify(r.data.user));
      onLogin(r.data.user);
      nav("/dashboard");
    } catch (e) {
      setErr(e.response?.data?.message || "Registration failed");
    }
  };
  return (
    <AuthShell wide title="Create your account" subtitle="Choose your role and start renting or listing.">
      {err && <div className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</div>}
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <label className="label">
          Name
          <input className="input mt-1" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        </label>
        <label className="label">
          Phone
          <input className="input mt-1" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
        </label>
        <label className="label">
          Email
          <input className="input mt-1" required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        </label>
        <label className="label">
          Password
          <input className="input mt-1" required type="password" minLength="6" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        </label>
        <label className="label sm:col-span-2">
          I am a
          <select className="input mt-1" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>
            <option value="tenant">Tenant — looking for a home</option>
          </select>
        </label>
        <button className="btn-primary sm:col-span-2" type="submit">Create account</button>
      </form>
      <p className="mt-4 text-sm text-slate-500">
        Already registered? <Link className="font-semibold text-navy-700" to="/login">Sign in</Link>
      </p>
    </AuthShell>
  );
}
