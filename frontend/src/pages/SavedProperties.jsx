import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

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
      <div className="section-head">
        <div>
          <p className="eyebrow">FAVOURITES</p>
          <h1>Saved properties</h1>
          <p className="muted">
            Homes you have bookmarked to review or apply to later.
          </p>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="empty">Loading saved properties...</div>
      ) : properties.length ? (
        <div className="table spaced">
          {properties.map((p) => (
            <div className="row" key={p._id}>
              <div>
                <Link to={`/properties/${p._id}`}>
                  <b>{p.title}</b>
                </Link>
                <span>
                  {p.city} · ₹{Number(p.rent).toLocaleString("en-IN")}/month
                </span>
              </div>

              <div className="actions">
                <span className={`status ${p.status}`}>{p.status}</span>
                <Link className="button" to={`/properties/${p._id}`}>
                  View
                </Link>
                <button onClick={() => unsave(p._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">
          You haven't saved any properties yet.{" "}
          <Link to="/properties">Explore homes →</Link>
        </div>
      )}
    </div>
  );
}
