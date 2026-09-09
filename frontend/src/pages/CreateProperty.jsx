import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
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

  // Load property when editing
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
          amenities: Array.isArray(p.amenities)
            ? p.amenities.join(", ")
            : "",
          images: Array.isArray(p.images)
            ? p.images.join(", ")
            : "",
          availability:
            p.availability !== undefined
              ? p.availability
              : true,
          status: p.status || "draft",
        });
      } catch (e) {
        setErr(
          e.response?.data?.message ||
            "Could not load property",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id, isEdit]);

  const updateField = (field, value) => {
    setF((prev) => ({
      ...prev,
      [field]: value,
    }));
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

        amenities: f.amenities
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),

        images: f.images
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),

        availability: f.availability,
        status: f.status,
      };

      let r;

      if (isEdit) {
        // EDIT
        r = await api.patch(
          `/properties/${id}`,
          body,
        );
      } else {
        // CREATE
        r = await api.post(
          "/properties",
          body,
        );
      }

      nav(`/properties/${r.data._id}`);
    } catch (e) {
      setErr(
        e.response?.data?.message ||
          e.response?.data?.error ||
          (isEdit
            ? "Could not update property"
            : "Could not create property"),
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
    <div className="page form-page">
      <p className="eyebrow">
        {isEdit ? "PROPERTY EDITOR" : "OWNER TOOLS"}
      </p>

      <h1>
        {isEdit
          ? "Edit property"
          : "List a new property"}
      </h1>

      <p className="muted">
        {isEdit
          ? "Update your property information below."
          : "Add the essentials now. You can edit the listing later."}
      </p>

      {err && (
        <div className="error">
          {err}
        </div>
      )}

      <form
        className="form-grid card-form"
        onSubmit={submit}
      >
        <label className="span2">
          Title

          <input
            required
            value={f.title}
            onChange={(e) =>
              updateField("title", e.target.value)
            }
            placeholder="2 BHK apartment in Wakad"
          />
        </label>

        <label>
          Description

          <textarea
            value={f.description}
            onChange={(e) =>
              updateField(
                "description",
                e.target.value,
              )
            }
          />
        </label>

        <label>
          Property type

          <select
            value={f.type}
            onChange={(e) =>
              updateField("type", e.target.value)
            }
          >
            <option value="apartment">
              Apartment
            </option>
            <option value="house">
              House
            </option>
            <option value="room">
              Room
            </option>
            <option value="studio">
              Studio
            </option>
            <option value="villa">
              Villa
            </option>
          </select>
        </label>

        <label>
          City

          <input
            required
            value={f.city}
            onChange={(e) =>
              updateField("city", e.target.value)
            }
          />
        </label>

        <label>
          Address

          <input
            value={f.address}
            onChange={(e) =>
              updateField(
                "address",
                e.target.value,
              )
            }
          />
        </label>

        <label>
          Monthly rent

          <input
            required
            type="number"
            value={f.rent}
            onChange={(e) =>
              updateField("rent", e.target.value)
            }
          />
        </label>

        <label>
          Deposit

          <input
            type="number"
            value={f.deposit}
            onChange={(e) =>
              updateField(
                "deposit",
                e.target.value,
              )
            }
          />
        </label>

        <label>
          Bedrooms

          <input
            type="number"
            min="0"
            value={f.bedrooms}
            onChange={(e) =>
              updateField(
                "bedrooms",
                e.target.value,
              )
            }
          />
        </label>

        <label>
          Bathrooms

          <input
            type="number"
            min="0"
            value={f.bathrooms}
            onChange={(e) =>
              updateField(
                "bathrooms",
                e.target.value,
              )
            }
          />
        </label>

        <label className="span2">
          Amenities{" "}
          <span className="hint">
            comma separated
          </span>

          <input
            value={f.amenities}
            onChange={(e) =>
              updateField(
                "amenities",
                e.target.value,
              )
            }
            placeholder="Parking, WiFi, Gym"
          />
        </label>

        <label className="span2">
          Image URLs{" "}
          <span className="hint">
            comma separated
          </span>

          <input
            value={f.images}
            onChange={(e) =>
              updateField(
                "images",
                e.target.value,
              )
            }
            placeholder="https://..."
          />
        </label>

        <label>
          Status

          <select
            value={f.status}
            onChange={(e) =>
              updateField(
                "status",
                e.target.value,
              )
            }
          >
            <option value="draft">
              Draft
            </option>

            <option value="published">
              Published
            </option>

            <option value="paused">
              Paused
            </option>
          </select>
        </label>

        <label className="check">
          <input
            type="checkbox"
            checked={f.availability}
            onChange={(e) =>
              updateField(
                "availability",
                e.target.checked,
              )
            }
          />

          Available for rent
        </label>

        <button
          className="primary span2"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : isEdit
            ? "Update property"
            : "Create property"}
        </button>
      </form>
    </div>
  );
}