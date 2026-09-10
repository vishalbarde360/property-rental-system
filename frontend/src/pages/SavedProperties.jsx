import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { inr, statusClass } from "../ui";

export default function SavedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const r = await api.get("/properties/saved/my");
      setProperties(Array.isArray(r.data) ? r.data : []);
    } catch (e) {
      setError(e.response?.data?.message || "Could not load saved properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const unsave = async (id) => {
    try {
      await api.delete(`/properties/${id}/save`);
      setProperties((cur) => cur.filter((p) => p._id !== id));
    } catch (e) {
      setError(e.response?.data?.message || "Could not remove property");
    }
  };

  return (
    <div className="page">
      <div>
        <p className="eyebrow">FAVOURITES</p>
        <h1 className="mt-1 text-3xl font-extrabold text-navy-900">Saved properties</h1>
        <p className="mt-2 text-slate-500">Homes you have bookmarked to review or apply to later.</p>
      </div>
      {error && <div className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
      {loading ? (
        <div className="mt-8 rounded-xl bg-slate-50 p-10 text-center text-slate-500">Loading saved properties...</div>
      ) : properties.length ? (
        <div className="mt-6 space-y-3">
          {properties.map((p) => (
            <div className="card flex flex-wrap items-center justify-between gap-3 p-4" key={p._id}>
              <div>
                <Link to={`/properties/${p._id}`}><b>{p.title}</b></Link>
                <p className="text-sm text-slate-500">
                  {p.city} · {inr(p.rent)}/month
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(p.status)}`}>{p.status}</span>
                <Link className="btn-secondary" to={`/properties/${p._id}`}>View</Link>
                <button className="btn-ghost text-rose-600" onClick={() => unsave(p._id)} type="button">Remove</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
          You haven't saved any properties yet.{" "}
          <Link className="font-semibold text-navy-700" to="/properties">Explore homes →</Link>
        </div>
      )}
    </div>
  );
}
