import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import AuthShell from "../components/AuthShell";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setResetToken("");
    setLoading(true);
    try {
      const r = await api.post("/auth/forgot-password", { email });
      setMsg(r.data.message || "If the email exists, a reset token has been generated.");
      if (r.data.resetToken) setResetToken(r.data.resetToken);
    } catch (e) {
      setErr(e.response?.data?.message || "Could not process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Reset your password" subtitle="Enter your account email and we'll generate a reset token.">
      {err && <div className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</div>}
      {msg && <div className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</div>}
      {resetToken && (
        <div className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Your reset token: <b>{resetToken}</b>
          <br />
          <Link className="font-semibold text-navy-700" to={`/reset-password/${resetToken}`}>
            Continue to reset password →
          </Link>
        </div>
      )}
      <form onSubmit={submit} className="space-y-4">
        <label className="label">
          Email
          <input className="input mt-1" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Sending..." : "Send reset token"}
        </button>
        <p className="text-sm text-slate-500">
          Remembered it? <Link className="font-semibold text-navy-700" to="/login">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
