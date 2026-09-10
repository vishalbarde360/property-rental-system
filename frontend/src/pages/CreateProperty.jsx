import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function CreateProperty() {
  const nav = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [f, setF] = useState({
    title: "",
    description: "",
    type: "apartment",
    address: "",
    city: "",
    rent: "",
    deposit: "",
    bedrooms: 1,
    bathrooms: 1,
    amenities: "",
    images: "",
    availability: true,
    status: "draft",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const loadProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        const p = res.data;
        setF({
          title: p.title || "",
          description: p.description || "",
          type: p.type || "apartment",
          address: p.address || "",
          city: p.city || "",
          rent: p.rent ?? "",
          deposit: p.deposit ?? "",
          bedrooms: p.bedrooms ?? 1,
          bathrooms: p.bathrooms ?? 1,
          amenities: Array.isArray(p.amenities) ? p.amenities.join(", ") : "",
          images: Array.isArray(p.images) ? p.images.join(", ") : "",
          availability: p.availability !== undefined ? p.availability : true,
          status: p.status || "draft",
        });
      } catch (e) {
        setErr(e.response?.data?.message || "Could not load property");
      } finally {
        setLoading(false);
      }
    };
    loadProperty();
  }, [id, isEdit]);

  const updateField = (field, value) => {
    setF((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      const body = {
        title: f.title,
        description: f.description,
        type: f.type,
        address: f.address,
        city: f.city,
        rent: Number(f.rent),
        deposit: Number(f.deposit || 0),
        bedrooms: Number(f.bedrooms),
        bathrooms: Number(f.bathrooms),
        amenities: f.amenities.split(",").map((x) => x.trim()).filter(Boolean),
        images: f.images.split(",").map((x) => x.trim()).filter(Boolean),
        availability: f.availability,
        status: f.status,
      };
      let r;
      if (isEdit) {
        r = await api.patch(`/properties/${id}`, body);
      } else {
        r = await api.post("/properties", body);
      }
      nav(`/properties/${r.data._id}`);
    } catch (e) {
      setErr(
        e.response?.data?.message ||
          e.response?.data?.error ||
          (isEdit ? "Could not update property" : "Could not create property"),
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p>Loading property...</p>
      </div>
    );
  }

  return (
    <div className="page max-w-3xl">
      <p className="eyebrow">{isEdit ? "PROPERTY EDITOR" : "OWNER TOOLS"}</p>
      <h1 className="mt-1 text-3xl font-extrabold text-navy-900">{isEdit ? "Edit property" : "List a new property"}</h1>
      <p className="mt-2 text-slate-500">
        {isEdit ? "Update your property information below." : "Add the essentials now. You can edit the listing later."}
      </p>
      {err && <div className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</div>}
      <form className="card mt-6 grid gap-4 p-5 sm:grid-cols-2" onSubmit={submit}>
        <label className="label sm:col-span-2">
          Title
          <input className="input mt-1" required value={f.title} onChange={(e) => updateField("title", e.target.value)} placeholder="2 BHK apartment in Wakad" />
        </label>
        <label className="label sm:col-span-2">
          Description
          <textarea className="input mt-1 min-h-24" value={f.description} onChange={(e) => updateField("description", e.target.value)} />
        </label>
        <label className="label">
          Property type
          <select className="input mt-1" value={f.type} onChange={(e) => updateField("type", e.target.value)}>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="room">Room</option>
            <option value="studio">Studio</option>
            <option value="villa">Villa</option>
          </select>
        </label>
        <label className="label">
          City
          <input className="input mt-1" required value={f.city} onChange={(e) => updateField("city", e.target.value)} />
        </label>
        <label className="label sm:col-span-2">
          Address
          <input className="input mt-1" value={f.address} onChange={(e) => updateField("address", e.target.value)} />
        </label>
        <label className="label">
          Monthly rent
          <input className="input mt-1" required type="number" value={f.rent} onChange={(e) => updateField("rent", e.target.value)} />
        </label>
        <label className="label">
          Deposit
          <input className="input mt-1" type="number" value={f.deposit} onChange={(e) => updateField("deposit", e.target.value)} />
        </label>
        <label className="label">
          Bedrooms
          <input className="input mt-1" type="number" min="0" value={f.bedrooms} onChange={(e) => updateField("bedrooms", e.target.value)} />
        </label>
        <label className="label">
          Bathrooms
          <input className="input mt-1" type="number" min="0" value={f.bathrooms} onChange={(e) => updateField("bathrooms", e.target.value)} />
        </label>
        <label className="label sm:col-span-2">
          Amenities <span className="font-normal text-slate-400">comma separated</span>
          <input className="input mt-1" value={f.amenities} onChange={(e) => updateField("amenities", e.target.value)} placeholder="Parking, WiFi, Gym" />
        </label>
        <label className="label sm:col-span-2">
          Image URLs <span className="font-normal text-slate-400">comma separated</span>
          <input className="input mt-1" value={f.images} onChange={(e) => updateField("images", e.target.value)} placeholder="https://..." />
        </label>
        <label className="label">
          Status
          <select className="input mt-1" value={f.status} onChange={(e) => updateField("status", e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="paused">Paused</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={f.availability} onChange={(e) => updateField("availability", e.target.checked)} />
          Available for rent
        </label>
        <button className="btn-primary sm:col-span-2" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update property" : "Create property"}
        </button>
      </form>
    </div>
  );
}
