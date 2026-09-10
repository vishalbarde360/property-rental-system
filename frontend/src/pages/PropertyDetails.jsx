import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { inr } from "../ui";

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
  if (!p) return <div className="page text-slate-500">Loading property…</div>;
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
  const img = p.images?.[0] || "/images/hero.jpg";
  return (
    <div className="page">
      <button className="btn-ghost mb-4" onClick={() => nav(-1)} type="button">
        ← Back
      </button>
      <div className="grid gap-8 lg:grid-cols-[1.4fr_.8fr]">
        <div>
          <div className="overflow-hidden rounded-2xl">
            <img src={img} alt="" className="h-[360px] w-full object-cover" />
          </div>
          <div className="mt-6">
            <span className="rounded-full bg-navy-700 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              {p.type}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-navy-900">{p.title}</h1>
            <p className="mt-1 text-slate-500">
              {p.city}
              {p.address ? ` · ${p.address}` : ""}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <b className="text-xl text-navy-800">
                {inr(p.rent)}
                <small className="ml-1 text-xs font-medium text-slate-500">/month</small>
              </b>
              <span className="rounded-lg bg-slate-50 px-3 py-1">
                {p.deposit
                  ? `${inr(p.deposit)} deposit`
                  : "No deposit listed"}
              </span>
              <span className="rounded-lg bg-slate-50 px-3 py-1">{p.bedrooms} bedrooms</span>
              <span className="rounded-lg bg-slate-50 px-3 py-1">{p.bathrooms} bathrooms</span>
            </div>
            <p className="mt-5 text-slate-600">{p.description || "No description provided."}</p>
            {p.amenities?.length > 0 && (
              <>
                <h3 className="mt-6 font-bold text-navy-900">Amenities</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.amenities.map((a) => (
                    <span key={a} className="rounded-full bg-navy-50 px-3 py-1 text-sm text-navy-800">
                      {a}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <aside className="card h-fit p-5">
          <p className="eyebrow">Owner</p>
          <h3 className="mt-1 text-lg font-bold">{p.ownerId?.name || "Property owner"}</h3>
          <p className="text-sm text-slate-500">{p.ownerId?.email}</p>

          {(!user || user.role === "tenant") && (
            <>
              <button className="btn-secondary mt-4 w-full" onClick={toggleSave} type="button">
                {saved ? "♥ Saved" : "♡ Save property"}
              </button>
              {saveErr && <div className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{saveErr}</div>}
            </>
          )}

          <hr className="my-4 border-slate-100" />
          <h3 className="font-bold">Interested?</h3>
          <textarea
            className="input mt-2 min-h-24"
            value={application}
            onChange={(e) => setApplication(e.target.value)}
          />
          <button className="btn-primary mt-3 w-full" onClick={apply} type="button">
            Apply for this property
          </button>
          {msg && <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</div>}

          <hr className="my-4 border-slate-100" />
          {reportOpen ? (
            <form onSubmit={submitReport}>
              <h3 className="font-bold">Report this listing</h3>
              <textarea
                className="input mt-2 min-h-24"
                required
                placeholder="What's wrong with this listing?"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              />
              <button className="btn-primary mt-3 w-full">Submit report</button>
            </form>
          ) : (
            <button className="btn-secondary w-full" onClick={() => setReportOpen(true)} type="button">
              Report this listing
            </button>
          )}
          {reportMsg && <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{reportMsg}</div>}
        </aside>
      </div>
      <section className="mt-10">
        <h2 className="text-2xl font-extrabold text-navy-900">Reviews</h2>
        {reviews.length ? (
          reviews.map((r) => (
            <div className="mt-4 rounded-xl border border-slate-100 p-4" key={r._id}>
              <b>{r.reviewerId?.name || "Tenant"}</b>
              <span className="ml-2 text-amber-500">
                {" "}
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </span>
              <p className="mt-1 text-slate-600">{r.comment}</p>
              {user &&
                ((user._id || user.id) === r.reviewerId?._id || user.role === "admin") && (
                  <button className="mt-2 text-sm font-semibold text-rose-600" onClick={() => deleteReview(r._id)} type="button">
                    Delete review
                  </button>
                )}
            </div>
          ))
        ) : (
          <p className="mt-3 text-slate-500">No reviews yet.</p>
        )}

        {user && user.role !== "owner" && (
          <form className="card mt-6 grid gap-4 p-5 sm:grid-cols-2" onSubmit={submitReview}>
            <h3 className="text-lg font-bold sm:col-span-2">Leave a review</h3>
            <p className="text-sm text-slate-500 sm:col-span-2">
              You can review a property once your application for it has been approved.
            </p>
            {reviewErr && <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 sm:col-span-2">{reviewErr}</div>}
            {reviewMsg && <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 sm:col-span-2">{reviewMsg}</div>}
            <label className="label">
              Rating
              <select
                className="input mt-1"
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} star{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="label sm:col-span-2">
              Comment
              <textarea
                className="input mt-1 min-h-24"
                required
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              />
            </label>
            <button className="btn-primary sm:col-span-2">Submit review</button>
          </form>
        )}
      </section>
    </div>
  );
}
