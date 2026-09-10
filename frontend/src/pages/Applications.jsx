import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { inr, statusClass } from "../ui";

export default function Applications({ user }) {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const r = await api.get("/applications");
      setItems(Array.isArray(r.data) ? r.data : []);
    } catch (e) {
      setErr(e.response?.data?.message || "Could not load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id, status) => {
    try {
      setErr("");
      await api.patch(`/applications/${id}/status`, { status });
      await load();
    } catch (e) {
      setErr(e.response?.data?.message || "Could not update application");
    }
  };

  const payRent = (application) => {
    nav(`/payments?applicationId=${application._id}`);
  };

  return (
    <div className="page">
      <p className="eyebrow">WORKFLOW</p>
      <h1 className="mt-1 text-3xl font-extrabold text-navy-900">
        {user.role === "owner" ? "Incoming applications" : "My applications"}
      </h1>
      <p className="mt-2 text-slate-500">
        {user.role === "owner"
          ? "Review and manage applications received from tenants."
          : "Track your rental applications and make payments for approved properties."}
      </p>
      {err && <div className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</div>}
      {loading ? (
        <div className="mt-8 rounded-xl bg-slate-50 p-10 text-center text-slate-500">Loading applications...</div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((a) => (
            <div className="card flex flex-wrap items-start justify-between gap-4 p-4" key={a._id}>
              <div>
                <b>{a.propertyId?.title || "Property"}</b>
                <p className="mt-1 text-sm text-slate-500">
                  {a.propertyId?.city || ""}
                  {a.propertyId?.rent
                    ? ` · ${inr(Number(a.propertyId.rent))}`
                    : ""}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {user.role === "owner"
                    ? `Tenant: ${a.tenantId?.name || ""}`
                    : `Owner: ${a.ownerId?.name || a.propertyId?.ownerId?.name || ""}`}
                </p>
                {a.message && <p className="mt-2 text-sm text-slate-600">{a.message}</p>}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(a.status)}`}>
                  {a.status?.replace("_", " ")}
                </span>
                {user.role === "owner" && (
                  <>
                    <button className="btn-secondary" onClick={() => update(a._id, "under_review")} type="button">Review</button>
                    <button className="btn-primary" onClick={() => update(a._id, "approved")} type="button">Approve</button>
                    <button className="btn-ghost text-rose-600" onClick={() => update(a._id, "rejected")} type="button">Reject</button>
                  </>
                )}
                {user.role !== "owner" && a.status === "approved" && (
                  <button className="btn-primary" onClick={() => payRent(a)} type="button">Pay Rent</button>
                )}
              </div>
            </div>
          ))}
          {!items.length && (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              No applications found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
