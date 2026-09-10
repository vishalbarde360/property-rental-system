import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { inr, statusClass } from "../ui";

export default function Dashboard({ user }) {
  const [apps, setApps] = useState([]);
  const [props, setProps] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [savedCount, setSavedCount] = useState(0);

  const loadProps = () =>
    api
      .get("/properties/owner/my")
      .then((r) => setProps(r.data))
      .catch(() => {});

  const loadEarnings = () =>
    api
      .get("/payments/owner/earnings")
      .then((r) => setEarnings(r.data))
      .catch(() => {});

  const loadSavedCount = () =>
    api
      .get("/properties/saved/my")
      .then((r) => setSavedCount(Array.isArray(r.data) ? r.data.length : 0))
      .catch(() => {});

  useEffect(() => {
    api
      .get("/applications")
      .then((r) => setApps(r.data))
      .catch(() => {});

    if (user.role === "owner") {
      loadProps();
      loadEarnings();
    }

    if (user.role === "tenant") {
      loadSavedCount();
    }
  }, [user.role]);

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property? This cannot be undone.")) return;
    try {
      await api.delete(`/properties/${id}`);
      await loadProps();
    } catch (e) {
      alert(e.response?.data?.message || "Could not delete property");
    }
  };

  return (
    <div className="page">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{user.role.toUpperCase()} DASHBOARD</p>
          <h1 className="mt-1 text-3xl font-extrabold text-navy-900">Hello, {user.name.split(" ")[0]}.</h1>
          <p className="mt-2 text-slate-500">Here is the latest activity on your rental journey.</p>
        </div>
        <div className="rounded-full bg-navy-50 px-4 py-1.5 text-sm font-semibold capitalize text-navy-800">{user.role}</div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat n={user.role === "owner" ? props.length : apps.length} label={user.role === "owner" ? "Your listings" : "Applications"} />
        <Stat n="—" label="Payments" />
        {user.role === "owner" ? (
          <Link to="/earnings" className="card p-5">
            <strong className="block text-2xl text-navy-900">{inr(earnings?.totalEarnings || 0)}</strong>
            <span className="text-sm text-slate-500">Total earnings</span>
          </Link>
        ) : (
          <Link to="/saved" className="card p-5">
            <strong className="block text-2xl text-navy-900">{savedCount}</strong>
            <span className="text-sm text-slate-500">Saved properties</span>
          </Link>
        )}
      </div>

      {user.role === "owner" ? (
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy-900">Your properties</h2>
            <Link className="btn-primary" to="/properties/new">+ Add property</Link>
          </div>
          {props.length ? (
            <div className="space-y-3">
              {props.map((p) => (
                <div className="card flex flex-wrap items-center justify-between gap-3 p-4" key={p._id}>
                  <div>
                    <b>{p.title}</b>
                    <span className="ml-2 text-sm text-slate-500">
                      {p.city} · {inr(p.rent)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(p.status)}`}>{p.status}</span>
                    <Link className="btn-secondary" to={`/properties/${p._id}/edit`}>Edit</Link>
                    <button className="btn-ghost text-rose-600" onClick={() => deleteProperty(p._id)} type="button">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              No properties yet.{" "}
              <Link className="font-semibold text-navy-700" to="/properties/new">List your first property →</Link>
            </div>
          )}
        </section>
      ) : (
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy-900">Application activity</h2>
            <Link className="btn-secondary" to="/applications">View all</Link>
          </div>
          {apps.length ? (
            <div className="space-y-3">
              {apps.slice(0, 5).map((a) => (
                <div className="card flex flex-wrap items-center justify-between gap-3 p-4" key={a._id}>
                  <div>
                    <b>{a.propertyId?.title || "Property"}</b>
                    <span className="ml-2 text-sm text-slate-500">
                      {a.propertyId?.city} · {a.propertyId?.rent?.toLocaleString?.("en-IN") || a.propertyId?.rent}
                    </span>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(a.status)}`}>
                    {a.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              No applications yet.{" "}
              <Link className="font-semibold text-navy-700" to="/properties">Explore homes →</Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function Stat({ n, label }) {
  return (
    <div className="card p-5">
      <strong className="block text-2xl text-navy-900">{n}</strong>
      <span className="text-sm text-slate-500">{label}</span>
    </div>
  );
}
