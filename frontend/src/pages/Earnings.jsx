import React, { useEffect, useState } from "react";
import api from "../services/api";
import { inr } from "../ui";

export default function Earnings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/payments/owner/earnings")
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.message || "Could not load earnings"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div>
        <p className="eyebrow">EARNINGS</p>
        <h1 className="mt-1 text-3xl font-extrabold text-navy-900">Total earnings</h1>
        <p className="mt-2 text-slate-500">
          A summary of the rent and deposit payments confirmed against your properties.
        </p>
      </div>
      {error && <div className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
      {loading ? (
        <div className="mt-8 rounded-xl bg-slate-50 p-10 text-center text-slate-500">Loading earnings...</div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="card p-5">
              <strong className="block text-2xl text-navy-900">{inr(data?.totalEarnings)}</strong>
              <span className="text-sm text-slate-500">Confirmed earnings</span>
            </div>
            <div className="card p-5">
              <strong className="block text-2xl text-navy-900">{inr(data?.pendingAmount)}</strong>
              <span className="text-sm text-slate-500">Pending confirmation</span>
            </div>
            <div className="card p-5">
              <strong className="block text-2xl text-navy-900">{data?.successCount || 0}</strong>
              <span className="text-sm text-slate-500">Successful payments</span>
            </div>
          </div>
          <section className="mt-10">
            <h2 className="text-xl font-bold text-navy-900">Earnings by property</h2>
            {data?.byProperty?.length ? (
              <div className="mt-4 space-y-3">
                {data.byProperty.map((row) => (
                  <div className="card flex items-center justify-between p-4" key={row.propertyId || row.title}>
                    <div>
                      <b>{row.title || "Property"}</b>
                      <p className="text-sm text-slate-500">
                        {row.city} · {row.count} payment{row.count === 1 ? "" : "s"}
                      </p>
                    </div>
                    <span className="font-semibold text-navy-800">{inr(row.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-8 text-slate-500">
                No confirmed payments yet. Once tenants pay and you confirm the payment, it will show up here.
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
