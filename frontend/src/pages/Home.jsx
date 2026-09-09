import "./Home.css"
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
export default function Home() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ properties: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    city: params.get("city") || "",
    type: params.get("type") || "",
    minRent: params.get("minRent") || "",
    maxRent: params.get("maxRent") || "",
    bedrooms: params.get("bedrooms") || "",
  });
  const load = async () => {
    setLoading(true);
    try {
      const q = Object.fromEntries(Object.entries(form).filter(([, v]) => v));
      setParams(q);
      const r = await api.get("/properties", { params: q });
      setData(r.data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">FIND A PLACE TO CALL HOME</p>
          <h1>
            Better homes.
            <br />
            <em>Less hassle.</em>
          </h1>
          <p className="hero-copy">
            Discover verified-style rental listings, apply online, track
            approvals and keep payment records in one simple place.
          </p>
        </div>
        <div className="hero-card">
          <div className="hero-stat">
            <strong>01</strong>
            <span>Search by city, rent & type</span>
          </div>
          <div className="hero-stat">
            <strong>02</strong>
            <span>Apply with a few clicks</span>
          </div>
          <div className="hero-stat">
            <strong>03</strong>
            <span>Track your rental journey</span>
          </div>
        </div>
      </section>
      <section className="searchbox">
        <input
          placeholder="City e.g. Pune"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="">Any type</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="room">Room</option>
          <option value="studio">Studio</option>
          <option value="villa">Villa</option>
        </select>
        <input
          type="number"
          placeholder="Min rent"
          value={form.minRent}
          onChange={(e) => setForm({ ...form, minRent: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max rent"
          value={form.maxRent}
          onChange={(e) => setForm({ ...form, maxRent: e.target.value })}
        />
        <button onClick={load}>Search homes</button>
      </section>
      <section className="section-head">
        <div>
          <p className="eyebrow">EXPLORE LISTINGS</p>
          <h2>Homes worth viewing</h2>
        </div>
        <span>{data.total} results</span>
      </section>
      {loading ? (
        <div className="empty">Loading properties…</div>
      ) : data.properties.length ? (
        <div className="grid">
          {data.properties.map((p) => (
            <PropertyCard key={p._id} p={p} />
          ))}
        </div>
      ) : (
        <div className="empty">
          No published properties found. Try another filter.
        </div>
      )}
    </div>
  );
}
function PropertyCard({ p }) {
  return (
    <Link className="property-card" to={`/properties/${p._id}`}>
      <div className="property-img">
        {p.images?.[0] ? (
          <img src={p.images[0]} alt="" />
        ) : (
          <div className="img-placeholder">⌂</div>
        )}
        <span className="pill">{p.type}</span>
      </div>
      <div className="property-body">
        <div>
          <h3>{p.title}</h3>
          <p>
            {p.city}
            {p.address ? ` · ${p.address}` : ""}
          </p>
        </div>
        <strong>
          ₹{Number(p.rent).toLocaleString("en-IN")}
          <small>/month</small>
        </strong>
        <div className="meta">
          <span>{p.bedrooms} beds</span>
          <span>{p.bathrooms} baths</span>
          <span>{p.availability ? "Available" : "Unavailable"}</span>
        </div>
      </div>
    </Link>
  );
}
