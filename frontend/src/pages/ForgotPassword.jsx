import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

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
      // The API returns the raw token directly since there is no email
      // service wired up yet — show it so the user can continue in-app.
      if (r.data.resetToken) setResetToken(r.data.resetToken);
    } catch (e) {
      setErr(e.response?.data?.message || "Could not process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-panel">
        <p className="eyebrow">RENTNEST</p>
        <h1>Reset your password</h1>
        <p>Enter your account email and we'll generate a reset token.</p>

        {err && <div className="error">{err}</div>}
        {msg && <div className="success">{msg}</div>}

        {resetToken && (
          <div className="success">
            Your reset token: <b>{resetToken}</b>
            <br />
            <Link to={`/reset-password/${resetToken}`}>
              Continue to reset password →
            </Link>
          </div>
        )}

        <form onSubmit={submit}>
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button className="primary full" disabled={loading}>
            {loading ? "Sending..." : "Send reset token"}
          </button>
          <p className="switch">
            Remembered it? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
