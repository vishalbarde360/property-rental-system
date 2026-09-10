import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { statusClass } from "../ui";

export default function Admin() {
  const [a, setA] = useState(null);
  const [users, setUsers] = useState([]);
  const [props, setProps] = useState([]);
  const [reports, setReports] = useState([]);
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

  const userStatus = async (id, status) => {
    try {
      await api.patch("/admin/users/" + id, { status });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  const propStatus = async (id, status) => {
    try {
      await api.patch("/admin/properties/" + id, { status });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update property");
    }
  };

  const reportStatus = async (id, status) => {
    try {
      await api.patch("/reports/" + id, { status });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update report");
    }
  };

  return (
    <div className="page">
      <nav className="mb-4 flex gap-3 text-sm">
        <Link className="font-semibold text-navy-700" to="/admin">Dashboard</Link>
        <Link className="text-slate-500 hover:text-navy-700" to="/applications">Applications</Link>
      </nav>
      <p className="eyebrow">CONTROL ROOM</p>
      <h1 className="mt-1 text-3xl font-extrabold text-navy-900">Admin dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {a &&
          Object.entries(a).map(([k, v]) => (
            <div className="card p-5" key={k}>
              <strong className="block text-2xl text-navy-900">{v}</strong>
              <span className="text-sm capitalize text-slate-500">{k}</span>
            </div>
          ))}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-navy-900">Users</h2>
        <div className="mt-4 space-y-3">
          {users.slice(0, 8).map((u) => (
            <div className="card flex flex-wrap items-center justify-between gap-3 p-4" key={u._id}>
              <div>
                <b>{u.name}</b>
                <p className="text-sm text-slate-500">
                  {u.email} · {u.role}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(u.status)}`}>
                  {u.status}
                </span>
                <button className="btn-secondary" onClick={() => setSelectedUser(u)} type="button">View</button>
                <button
                  className="btn-ghost"
                  onClick={() => userStatus(u._id, u.status === "disabled" ? "active" : "disabled")}
                  type="button"
                >
                  {u.status === "disabled" ? "Enable" : "Disable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-navy-900">Properties</h2>
        <div className="mt-4 space-y-3">
          {props.slice(0, 8).map((p) => (
            <div className="card flex flex-wrap items-center justify-between gap-3 p-4" key={p._id}>
              <div>
                <b>{p.title}</b>
                <p className="text-sm text-slate-500">
                  {p.city} · {p.ownerId?.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(p.status)}`}>
                  {p.status}
                </span>
                <Link className="btn-secondary" to={`/properties/${p._id}/edit`}>Edit</Link>
                <button
                  className="btn-ghost"
                  onClick={() => propStatus(p._id, p.status === "paused" ? "published" : "paused")}
                  type="button"
                >
                  {p.status === "paused" ? "Publish" : "Pause"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-navy-900">Reports</h2>
        <div className="mt-4 space-y-3">
          {reports.slice(0, 8).map((r) => (
            <div className="card flex flex-wrap items-center justify-between gap-3 p-4" key={r._id}>
              <div>
                <b>{r.reason}</b>
                <p className="text-sm text-slate-500">
                  {r.targetType} · {r.reporterId?.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(r.status)}`}>
                  {r.status}
                </span>
                {r.status === "open" && (
                  <>
                    <button className="btn-primary" onClick={() => reportStatus(r._id, "resolved")} type="button">Resolve</button>
                    <button className="btn-ghost text-rose-600" onClick={() => reportStatus(r._id, "rejected")} type="button">Reject</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4" onClick={() => setSelectedUser(null)}>
          <div className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold text-navy-900">User Details</h2>
              <button className="text-slate-400" onClick={() => setSelectedUser(null)} type="button">×</button>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div><strong className="block text-xs uppercase tracking-wide text-slate-400">Name</strong><span>{selectedUser.name || "Not provided"}</span></div>
              <div><strong className="block text-xs uppercase tracking-wide text-slate-400">Email</strong><span>{selectedUser.email || "Not provided"}</span></div>
              <div><strong className="block text-xs uppercase tracking-wide text-slate-400">Phone</strong><span>{selectedUser.phone || "Not provided"}</span></div>
              <div><strong className="block text-xs uppercase tracking-wide text-slate-400">Role</strong><span>{selectedUser.role ? selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1) : "Not provided"}</span></div>
              <div><strong className="block text-xs uppercase tracking-wide text-slate-400">Status</strong><span>{selectedUser.status ? selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1) : "Not provided"}</span></div>
            </div>
            <button className="btn-primary mt-6 w-full" onClick={() => setSelectedUser(null)} type="button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
