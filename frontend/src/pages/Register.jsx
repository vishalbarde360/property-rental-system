import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
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
    <div className="auth-wrap">
      <div className="auth-panel wide">
        <p className="eyebrow">JOIN RENTNEST</p>
        <h1>Create your account</h1>
        <p>Choose your role and start renting or listing.</p>
        {err && <div className="error">{err}</div>}
        <form onSubmit={submit} className="form-grid">
          <label>
            Name
            <input
              required
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
            />
          </label>
          <label>
            Phone
            <input
              value={f.phone}
              onChange={(e) => setF({ ...f, phone: e.target.value })}
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              value={f.email}
              onChange={(e) => setF({ ...f, email: e.target.value })}
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              minLength="6"
              value={f.password}
              onChange={(e) => setF({ ...f, password: e.target.value })}
            />
          </label>
          <label className="span2">
            I am a
            <select
              value={f.role}
              onChange={(e) => setF({ ...f, role: e.target.value })}
            >
              <option value="tenant">Tenant — looking for a home</option>
            
            </select>
          </label>
          <button className="primary span2">Create account</button>
        </form>
        <p className="switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
