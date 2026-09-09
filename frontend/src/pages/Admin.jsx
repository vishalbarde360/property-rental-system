import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Admin() {
  const [a, setA] = useState(null);
  const [users, setUsers] = useState([]);
  const [props, setProps] = useState([]);
  const [reports, setReports] = useState([]);

  // Selected user for View modal
  const [selectedUser, setSelectedUser] = useState(null);

  const load = () =>
    Promise.all([
      api.get("/admin/analytics"),
      api.get("/admin/users"),
      api.get("/admin/properties"),
      api.get("/admin/reports"),
    ]).then(([x, u, p, r]) => {
      setA(x.data);
      setUsers(u.data);
      setProps(p.data);
      setReports(r.data);
    });

  useEffect(() => {
    load();
  }, []);

  // User Enable / Disable
  const userStatus = async (id, status) => {
    try {
      await api.patch("/admin/users/" + id, { status });
      load();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update user"
      );
    }
  };

  // Property Publish / Pause
  const propStatus = async (id, status) => {
    try {
      await api.patch("/admin/properties/" + id, { status });
      load();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update property"
      );
    }
  };

  // Report Resolve / Reject
  const reportStatus = async (id, status) => {
    try {
      await api.patch("/reports/" + id, { status });
      load();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update report"
      );
    }
  };

  return (
    <div className="page">

      {/* Admin Navigation */}
      <nav className="admin-nav">
        <Link to="/admin">Dashboard</Link>
        <Link to="/applications">Applications</Link>
      </nav>

      <p className="eyebrow">CONTROL ROOM</p>

      <h1>Admin dashboard</h1>

      {/* ================= STATS ================= */}
      <div className="stats">
        {a &&
          Object.entries(a).map(([k, v]) => (
            <div className="stat" key={k}>
              <strong>{v}</strong>
              <span>{k}</span>
            </div>
          ))}
      </div>

      {/* ================= USERS ================= */}
      <section>
        <h2>Users</h2>

        <div className="table">
          {users.slice(0, 8).map((u) => (
            <div className="row" key={u._id}>

              <div>
                <b>{u.name}</b>

                <span>
                  {u.email} · {u.role}
                </span>
              </div>

              <div className="actions">

                {/* Status */}
                <span
                  className={`status ${u.status}`}
                >
                  {u.status}
                </span>

                {/* View User */}
                <button
                  className="view-btn"
                  onClick={() => setSelectedUser(u)}
                >
                  View
                </button>

                {/* Enable / Disable */}
                <button
                  onClick={() =>
                    userStatus(
                      u._id,
                      u.status === "disabled"
                        ? "active"
                        : "disabled"
                    )
                  }
                >
                  {u.status === "disabled"
                    ? "Enable"
                    : "Disable"}
                </button>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PROPERTIES ================= */}
      <section>
        <h2>Properties</h2>

        <div className="table">
          {props.slice(0, 8).map((p) => (
            <div className="row" key={p._id}>

              <div>
                <b>{p.title}</b>

                <span>
                  {p.city} · {p.ownerId?.name}
                </span>
              </div>

              <div className="actions">

                {/* Property Status */}
                <span
                  className={`status ${p.status}`}
                >
                  {p.status}
                </span>

                {/* Edit Property */}
                <Link
                  to={`/properties/${p._id}/edit`}
                  className="button"
                >
                  Edit
                </Link>

                {/* Publish / Pause */}
                <button
                  onClick={() =>
                    propStatus(
                      p._id,
                      p.status === "paused"
                        ? "published"
                        : "paused"
                    )
                  }
                >
                  {p.status === "paused"
                    ? "Publish"
                    : "Pause"}
                </button>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= REPORTS ================= */}
      <section>
        <h2>Reports</h2>

        <div className="table">
          {reports.slice(0, 8).map((r) => (
            <div className="row" key={r._id}>

              <div>
                <b>{r.reason}</b>

                <span>
                  {r.targetType} · {r.reporterId?.name}
                </span>
              </div>

              <div className="actions">

                <span
                  className={`status ${r.status}`}
                >
                  {r.status}
                </span>

                {r.status === "open" && (
                  <>
                    <button
                      onClick={() =>
                        reportStatus(
                          r._id,
                          "resolved"
                        )
                      }
                    >
                      Resolve
                    </button>

                    <button
                      onClick={() =>
                        reportStatus(
                          r._id,
                          "rejected"
                        )
                      }
                    >
                      Reject
                    </button>
                  </>
                )}

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= USER VIEW MODAL ================= */}
      {selectedUser && (
        <div
          className="user-modal-overlay"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="user-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close */}
            <button
              className="modal-close"
              onClick={() => setSelectedUser(null)}
            >
              ×
            </button>

            <h2>User Details</h2>

            {/* Name */}
            <div className="user-detail">
              <strong>Name</strong>
              <span>
                {selectedUser.name || "Not provided"}
              </span>
            </div>

            {/* Email */}
            <div className="user-detail">
              <strong>Email</strong>
              <span>
                {selectedUser.email || "Not provided"}
              </span>
            </div>

            {/* Phone */}
            <div className="user-detail">
              <strong>Phone</strong>
              <span>
                {selectedUser.phone || "Not provided"}
              </span>
            </div>

            {/* Role */}
            <div className="user-detail">
              <strong>Role</strong>
              <span>
                {selectedUser.role
                  ? selectedUser.role
                      .charAt(0)
                      .toUpperCase() +
                    selectedUser.role.slice(1)
                  : "Not provided"}
              </span>
            </div>

            {/* Status */}
            <div className="user-detail">
              <strong>Status</strong>
              <span>
                {selectedUser.status
                  ? selectedUser.status
                      .charAt(0)
                      .toUpperCase() +
                    selectedUser.status.slice(1)
                  : "Not provided"}
              </span>
            </div>

            {/* Close Button */}
            <button
              className="modal-close-btn"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}