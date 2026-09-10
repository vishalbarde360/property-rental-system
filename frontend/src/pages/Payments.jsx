import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { inr, statusClass } from "../ui";

export default function Payments({ user }) {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const applicationId = searchParams.get("applicationId");
  const [payments, setPayments] = useState([]);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    amount: "",
    type: "rent",
    method: "upi",
    transactionReference: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const paymentResponse = await api.get("/payments");
      setPayments(Array.isArray(paymentResponse.data) ? paymentResponse.data : []);
      if (applicationId) {
        const applicationResponse = await api.get("/applications");
        const found = applicationResponse.data.find(
          (a) => String(a._id) === String(applicationId),
        );
        if (!found) {
          setError("Application not found.");
          return;
        }
        setApplication(found);
        setForm((prev) => ({ ...prev, amount: found.propertyId?.rent || "" }));
      } else {
        setApplication(null);
      }
    } catch (e) {
      setError(e.response?.data?.message || "Could not load payment information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [applicationId]);

  const submitPayment = async (e) => {
    e.preventDefault();
    if (!application) {
      setError("Please select an approved application.");
      return;
    }
    const receiverId =
      application.ownerId?._id ||
      application.ownerId ||
      application.propertyId?.ownerId?._id ||
      application.propertyId?.ownerId;
    if (!receiverId) {
      setError("Owner information is not available.");
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      await api.post("/payments", {
        applicationId: application._id,
        amount: Number(form.amount),
        type: form.type,
        method: form.method,
        receiverId,
        transactionReference: form.transactionReference.trim(),
        status: "pending",
      });
      alert("Payment created successfully!");
      nav("/payments");
    } catch (e) {
      setError(
        e.response?.data?.message ||
          e.response?.data?.error ||
          "Could not create payment",
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmPayment = async (paymentId) => {
    try {
      setError("");
      await api.patch(`/payments/${paymentId}`, { status: "success" });
      alert("Payment confirmed successfully!");
      await load();
    } catch (e) {
      setError(e.response?.data?.message || "Could not confirm payment");
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusText = (status) => {
    if (status === "success") return "Success";
    if (status === "failed") return "Failed";
    return "Pending";
  };

  const typeText = (type) => (type === "deposit" ? "Deposit" : "Rent");

  const methodText = (method) => {
    if (method === "bank_transfer") return "Bank Transfer";
    if (method === "upi") return "UPI";
    if (method === "card") return "Card";
    if (method === "cash") return "Cash";
    return method || "—";
  };

  return (
    <div className="page">
      <div>
        <p className="eyebrow">PAYMENTS</p>
        <h1 className="mt-1 text-3xl font-extrabold text-navy-900">
          {user?.role === "owner" ? "Received Payments" : "My Payments"}
        </h1>
        <p className="mt-2 text-slate-500">
          {user?.role === "owner"
            ? "View and confirm payments received from tenants."
            : "Manage your rent and deposit payments."}
        </p>
      </div>
      {error && <div className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
      {user?.role === "tenant" && applicationId && application && (
        <section className="card mt-6 p-5">
          <h2 className="text-xl font-bold text-navy-900">Make a Payment</h2>
          <p className="mt-1 text-slate-500">{application.propertyId?.title || "Property"}</p>
          <p className="text-sm text-slate-500">Rent: {inr(application.propertyId?.rent)}</p>
          <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={submitPayment}>
            <label className="label">
              Amount
              <input
                className="input mt-1"
                required
                type="number"
                min="1"
                value={form.amount}
                onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
              />
            </label>
            <label className="label">
              Payment Type
              <select
                className="input mt-1"
                value={form.type}
                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
              >
                <option value="rent">Rent</option>
                <option value="deposit">Deposit</option>
              </select>
            </label>
            <label className="label">
              Payment Method
              <select
                className="input mt-1"
                value={form.method}
                onChange={(e) => setForm((prev) => ({ ...prev, method: e.target.value }))}
              >
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </label>
            <label className="label">
              Transaction Reference <span className="font-normal text-slate-400">optional</span>
              <input
                className="input mt-1"
                value={form.transactionReference}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, transactionReference: e.target.value }))
                }
                placeholder="UPI123456"
              />
            </label>
            <div className="flex gap-2 sm:col-span-2">
              <button className="btn-primary" type="submit" disabled={saving}>
                {saving ? "Processing..." : "Pay Now"}
              </button>
              <button className="btn-secondary" type="button" onClick={() => nav("/payments")}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
      {loading ? (
        <div className="mt-8 rounded-xl bg-slate-50 p-10 text-center text-slate-500">Loading payments...</div>
      ) : payments.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
          <h3 className="text-lg font-bold text-navy-900">No payments yet</h3>
          <p className="mt-1">Your rent and deposit payments will appear here.</p>
        </div>
      ) : (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-navy-900">Payment History</h2>
          <div className="mt-4 space-y-3">
            {payments.map((p) => {
              const currentUserId = user?._id || user?.id;
              const isReceiver =
                String(p.receiverId?._id || p.receiverId) === String(currentUserId);
              return (
                <div className="card flex flex-wrap items-start justify-between gap-4 p-4" key={p._id}>
                  <div>
                    <b className="text-navy-900">{inr(p.amount)}</b>
                    <p className="mt-1 text-sm text-slate-500">
                      {typeText(p.type)} · {methodText(p.method)}
                    </p>
                    {isReceiver ? (
                      <p className="text-sm text-slate-500">From: {p.payerId?.name || "Tenant"}</p>
                    ) : (
                      <p className="text-sm text-slate-500">To: {p.receiverId?.name || "Owner"}</p>
                    )}
                    {p.transactionReference && (
                      <p className="text-sm text-slate-500">Ref: {p.transactionReference}</p>
                    )}
                    <p className="text-sm text-slate-400">{formatDate(p.paidAt || p.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(p.status)}`}>
                      {statusText(p.status)}
                    </span>
                    {user?.role === "owner" && p.status === "pending" && (
                      <button className="btn-primary" onClick={() => confirmPayment(p._id)} type="button">
                        Confirm Payment
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
