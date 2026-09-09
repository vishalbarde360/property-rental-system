import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
      setErr(
        e.response?.data?.message ||
          "Could not load applications"
      );
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

      await api.patch(
        `/applications/${id}/status`,
        { status }
      );

      await load();
    } catch (e) {
      setErr(
        e.response?.data?.message ||
          "Could not update application"
      );
    }
  };

  const payRent = (application) => {
  nav(`/payments?applicationId=${application._id}`);
};

  return (
    <div className="page">
      <p className="eyebrow">WORKFLOW</p>

      <h1>
        {user.role === "owner"
          ? "Incoming applications"
          : "My applications"}
      </h1>

      <p className="muted">
        {user.role === "owner"
          ? "Review and manage applications received from tenants."
          : "Track your rental applications and make payments for approved properties."}
      </p>

      {err && (
        <div className="error">
          {err}
        </div>
      )}

      {loading ? (
        <div className="empty">
          Loading applications...
        </div>
      ) : (
        <div className="table spaced">
          {items.map((a) => (
            <div
              className="row app-row"
              key={a._id}
            >
              <div>
                <b>
                  {a.propertyId?.title ||
                    "Property"}
                </b>

                <span>
                  {a.propertyId?.city || ""}

                  {a.propertyId?.rent
                    ? ` · ₹${Number(
                        a.propertyId.rent
                      ).toLocaleString("en-IN")}`
                    : ""}
                </span>

                <span>
                  {user.role === "owner"
                    ? `Tenant: ${
                        a.tenantId?.name || ""
                      }`
                    : `Owner: ${
                        a.ownerId?.name ||
                        a.propertyId?.ownerId
                          ?.name ||
                        ""
                      }`}
                </span>

                {a.message && (
                  <span>
                    {a.message}
                  </span>
                )}
              </div>

              <div className="actions">
                <span
                  className={`status ${a.status}`}
                >
                  {a.status?.replace(
                    "_",
                    " "
                  )}
                </span>

                {/* OWNER ACTIONS */}
                {user.role === "owner" && (
                  <>
                    <button
                      onClick={() =>
                        update(
                          a._id,
                          "under_review"
                        )
                      }
                    >
                      Review
                    </button>

                    <button
                      onClick={() =>
                        update(
                          a._id,
                          "approved"
                        )
                      }
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        update(
                          a._id,
                          "rejected"
                        )
                      }
                    >
                      Reject
                    </button>
                  </>
                )}

                {/* TENANT PAYMENT */}
                {user.role !== "owner" &&
                  a.status === "approved" && (
                    <button
                      className="primary"
                      onClick={() =>
                        payRent(a)
                      }
                    >
                      Pay Rent
                    </button>
                  )}
              </div>
            </div>
          ))}

          {!items.length && (
            <div className="empty">
              No applications found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}