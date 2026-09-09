import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Earnings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/payments/owner/earnings")
      .then((r) => setData(r.data))
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load earnings"),
      )
      .finally(() => setLoading(false));
  }, []);

  const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  return (
    <div className="page">
      <div className="section-head">
        <div>
          <p className="eyebrow">EARNINGS</p>
          <h1>Total earnings</h1>
          <p className="muted">
            A summary of the rent and deposit payments confirmed against your
            properties.
          </p>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="empty">Loading earnings...</div>
      ) : (
        <>
          <div className="stats">
            <div className="stat">
              <strong>{inr(data?.totalEarnings)}</strong>
              <span>Confirmed earnings</span>
            </div>
            <div className="stat">
              <strong>{inr(data?.pendingAmount)}</strong>
              <span>Pending confirmation</span>
            </div>
            <div className="stat">
              <strong>{data?.successCount || 0}</strong>
              <span>Successful payments</span>
            </div>
          </div>

          <section>
            <h2>Earnings by property</h2>

            {data?.byProperty?.length ? (
              <div className="table">
                {data.byProperty.map((row) => (
                  <div className="row" key={row.propertyId || row.title}>
                    <div>
                      <b>{row.title || "Property"}</b>
                      <span>
                        {row.city} · {row.count} payment
                        {row.count === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="actions">
                      <span className="status">{inr(row.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty">
                No confirmed payments yet. Once tenants pay and you confirm
                the payment, it will show up here.
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
