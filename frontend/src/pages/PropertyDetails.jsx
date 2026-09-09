import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
export default function PropertyDetails({ user }) {
  const { id } = useParams(),
    nav = useNavigate();
  const [p, setP] = useState(null),
    [reviews, setReviews] = useState([]),
    [msg, setMsg] = useState("");
  const [application, setApplication] = useState(
    "I am interested in this property.",
  );
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewErr, setReviewErr] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportMsg, setReportMsg] = useState("");
  const [saved, setSaved] = useState(false);
  const [saveErr, setSaveErr] = useState("");

  const loadReviews = () =>
    api.get("/reviews/property/" + id).then((r) => setReviews(r.data));

  useEffect(() => {
    api.get("/properties/" + id).then((r) => setP(r.data));
    loadReviews();
  }, [id]);

  useEffect(() => {
    if (!user || user.role !== "tenant") {
      setSaved(false);
      return;
    }
    api
      .get("/properties/saved/my")
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : [];
        setSaved(list.some((sp) => sp._id === id));
      })
      .catch(() => {});
  }, [id, user]);

  const toggleSave = async () => {
    if (!user) {
      nav("/login");
      return;
    }
    setSaveErr("");
    try {
      if (saved) {
        await api.delete(`/properties/${id}/save`);
        setSaved(false);
      } else {
        await api.post(`/properties/${id}/save`);
        setSaved(true);
      }
    } catch (e) {
      setSaveErr(e.response?.data?.message || "Could not update saved list");
    }
  };
  if (!p) return <div className="empty">Loading property…</div>;
  const apply = async () => {
    if (!user) {
      nav("/login");
      return;
    }
    try {
      await api.post(`/applications/property/${id}`, { message: application });
      setMsg("Application submitted successfully.");
    } catch (e) {
      setMsg(e.response?.data?.message || "Could not apply");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewErr("");
    setReviewMsg("");
    if (!user) {
      nav("/login");
      return;
    }
    try {
      await api.post("/reviews", {
        propertyId: id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });
      setReviewForm({ rating: 5, comment: "" });
      setReviewMsg("Review submitted. Thank you!");
      await loadReviews();
    } catch (e) {
      setReviewErr(e.response?.data?.message || "Could not submit review");
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      await loadReviews();
    } catch (e) {
      setReviewErr(e.response?.data?.message || "Could not delete review");
    }
  };

  const submitReport = async (e) => {
    e.preventDefault();
    setReportMsg("");
    if (!user) {
      nav("/login");
      return;
    }
    try {
      await api.post("/reports", {
        targetType: "property",
        targetId: id,
        reason: reportReason,
      });
      setReportMsg("Report submitted. Our team will review it.");
      setReportReason("");
      setReportOpen(false);
    } catch (e) {
      setReportMsg(e.response?.data?.message || "Could not submit report");
    }
  };
  return (
    <div className="detail page">
      <button className="back" onClick={() => nav(-1)}>
        ← Back
      </button>
      <div className="detail-grid">
        <div>
          <div className="detail-image">
            {p.images?.[0] ? (
              <img src={p.images[0]} alt="" />
            ) : (
              <div className="img-placeholder big">⌂</div>
            )}
          </div>
          <div className="detail-copy">
            <span className="pill dark">{p.type}</span>
            <h1>{p.title}</h1>
            <p className="location">
              {p.city}
              {p.address ? ` · ${p.address}` : ""}
            </p>
            <div className="feature-row">
              <b>
                ₹{Number(p.rent).toLocaleString("en-IN")}
                <small>/month</small>
              </b>
              <span>
                {p.deposit
                  ? `₹${Number(p.deposit).toLocaleString("en-IN")} deposit`
                  : "No deposit listed"}
              </span>
              <span>{p.bedrooms} bedrooms</span>
              <span>{p.bathrooms} bathrooms</span>
            </div>
            <p>{p.description || "No description provided."}</p>
            {p.amenities?.length > 0 && (
              <>
                <h3>Amenities</h3>
                <div className="tags">
                  {p.amenities.map((a) => (
                    <span key={a}>{a}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <aside className="apply-card">
          <p className="eyebrow">OWNER</p>
          <h3>{p.ownerId?.name || "Property owner"}</h3>
          <p>{p.ownerId?.email}</p>

          {(!user || user.role === "tenant") && (
            <>
              <button className="button full" onClick={toggleSave}>
                {saved ? "★ Saved" : "☆ Save property"}
              </button>
              {saveErr && <div className="error">{saveErr}</div>}
            </>
          )}

          <hr />
          <h3>Interested?</h3>
          <textarea
            value={application}
            onChange={(e) => setApplication(e.target.value)}
          />
          <button className="primary full" onClick={apply}>
            Apply for this property
          </button>
          {msg && <div className="success">{msg}</div>}

          <hr />
          {reportOpen ? (
            <form onSubmit={submitReport}>
              <h3>Report this listing</h3>
              <textarea
                required
                placeholder="What's wrong with this listing?"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              />
              <button className="primary full">Submit report</button>
            </form>
          ) : (
            <button className="button full" onClick={() => setReportOpen(true)}>
              Report this listing
            </button>
          )}
          {reportMsg && <div className="success">{reportMsg}</div>}
        </aside>
      </div>
      <section className="reviews">
        <h2>Reviews</h2>
        {reviews.length ? (
          reviews.map((r) => (
            <div className="review" key={r._id}>
              <b>{r.reviewerId?.name || "Tenant"}</b>
              <span>
                {" "}
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </span>
              <p>{r.comment}</p>
              {user &&
                ((user._id || user.id) === r.reviewerId?._id ||
                  user.role === "admin") && (
                  <button className="linkbtn" onClick={() => deleteReview(r._id)}>
                    Delete review
                  </button>
                )}
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}

        {user && user.role !== "owner" && (
          <form className="form-grid card-form" onSubmit={submitReview}>
            <h3 className="span2">Leave a review</h3>
            <p className="muted span2">
              You can review a property once your application for it has
              been approved.
            </p>
            {reviewErr && <div className="error span2">{reviewErr}</div>}
            {reviewMsg && <div className="success span2">{reviewMsg}</div>}
            <label>
              Rating
              <select
                value={reviewForm.rating}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, rating: e.target.value })
                }
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} star{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="span2">
              Comment
              <textarea
                required
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comment: e.target.value })
                }
              />
            </label>
            <button className="primary span2">Submit review</button>
          </form>
        )}
      </section>
    </div>
  );
}
