import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import AuthShell from "../components/AuthShell";

export default function ResetPassword() {
  const { token } = useParams();
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (password !== confirm) {
      setErr("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      nav("/login");
    } catch (e) {
      setErr(e.response?.data?.message || "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Set a new password" subtitle="Choose a new password for your account.">
      {err && <div className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</div>}
      <form onSubmit={submit} className="space-y-4">
        <label className="label">
          New password
          <input className="input mt-1" type="password" required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label className="label">
          Confirm password
          <input className="input mt-1" type="password" required minLength="6" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Updating..." : "Update password"}
        </button>
        <p className="text-sm text-slate-500">
          <Link className="font-semibold text-navy-700" to="/login">Back to sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
