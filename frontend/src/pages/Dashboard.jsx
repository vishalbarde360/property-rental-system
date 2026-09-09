import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Dashboard({ user}) {
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
    <div className="page dashboard">
      <section className="dash-hero">
        <div>
          <p className="eyebrow">{user.role.toUpperCase()} DASHBOARD</p>

          <h1>Hello, {user.name.split(" ")[0]}.</h1>

          <p>
            Here is the latest activity on your rental journey.
          </p>
        </div>

        <div className="role-badge">{user.role}</div>
      </section>

      {/* Stats */}
      <div className="stats">
        <Stat
          n={user.role === "owner" ? props.length : apps.length}
          label={user.role === "owner" ? "Your listings" : "Applications"}
        />

        <Stat n="—" label="Payments" />

        {user.role === "owner" ? (
          <Link to="/earnings" className="stat">
            <strong>
              ₹{Number(earnings?.totalEarnings || 0).toLocaleString("en-IN")}
            </strong>
            <span>Total earnings</span>
          </Link>
        ) : (
          <Link to="/saved" className="stat">
            <strong>{savedCount}</strong>
            <span>Saved properties</span>
          </Link>
        )}
      </div>

      {/* OWNER DASHBOARD */}
      {user.role === "owner" ? (
        <section>
          <div className="section-head">
            <h2>Your properties</h2>

            <Link className="button" to="/properties/new">
              + Add property
            </Link>
          </div>

          {props.length ? (
            <div className="table">
              {props.map((p) => (
  <div className="row" key={p._id}>
    <div>
      <b>{p.title}</b>
      <span>
        {p.city} · ₹{Number(p.rent).toLocaleString("en-IN")}
      </span>
    </div>

    <div className="actions">
      <span className={`status ${p.status}`}>
        {p.status}
      </span>

      <Link
        className="button"
        to={`/properties/${p._id}/edit`}
      >
        Edit
      </Link>

      <button onClick={() => deleteProperty(p._id)}>
        Delete
      </button>
    </div>
  </div>
))}
            </div>
          ) : (
            <div className="empty">
              No properties yet.{" "}
              <Link to="/properties/new">
                List your first property →
              </Link>
            </div>
          )}
        </section>
      ) : (
        /* TENANT DASHBOARD */
        <section>
          <div className="section-head">
            <h2>Application activity</h2>

            <Link className="button" to="/applications">
              View all
            </Link>
          </div>

          {apps.length ? (
            <div className="table">
              {apps.slice(0, 5).map((a) => (
                <div className="row" key={a._id}>
                  <div>
                    <b>
                      {a.propertyId?.title || "Property"}
                    </b>

                    <span>
                      {a.propertyId?.city} · ₹
                      {a.propertyId?.rent?.toLocaleString?.("en-IN") ||
                        a.propertyId?.rent}
                    </span>
                  </div>

                  <span className={`status ${a.status}`}>
                    {a.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">
              No applications yet.{" "}
              <Link to="/properties">
                Explore homes →
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function Stat({ n, label }) {
  return (
    <div className="stat">
      <strong>{n}</strong>
      <span>{label}</span>
    </div>
  );
}