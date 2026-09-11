import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import PropertyCard from "../components/PropertyCard";

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
  const [tab, setTab] = useState("rent");

  const heroImages = [
    "/images/house-3.jpg",
    "/images/hero.jpg",
    "/images/house-1.jpg",
    "/images/house-2.jpg",
  ];
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const load = async (nextForm = form) => {
    setLoading(true);
    try {
      const q = Object.fromEntries(Object.entries(nextForm).filter(([, v]) => v));
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

  const setType = (type) => {
    const next = { ...form, type };
    setForm(next);
    load(next);
  };

  return (
    <div>
      <section className="relative mx-4 mt-4 overflow-hidden rounded-[28px] bg-slate-900 sm:mx-6">
        {heroImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === heroIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />

        <div className="relative z-10 flex min-h-[420px] flex-col justify-between gap-8 px-6 pb-16 pt-8 sm:min-h-[500px] sm:px-10 sm:pb-20">
          <div className="grid gap-3 text-white/90 sm:grid-cols-3">
            <p className="max-w-[180px] text-xs leading-relaxed">
              Dream bigger.
              <br />
              Live in style.
            </p>
            <p className="hidden max-w-[180px] text-xs leading-relaxed sm:block sm:justify-self-center">
              Architectural
              <br />
              masterpiece.
            </p>
            <p className="hidden max-w-[180px] text-xs leading-relaxed sm:block sm:justify-self-end">
              Space for life
              <br />
              and rest.
            </p>
          </div>

          <h1 className="px-2 text-center text-5xl font-semibold tracking-tight text-white/90 sm:text-7xl md:text-8xl lg:text-9xl">
            {"HOMELUXE".split("").map((ch, i) => (
              <span
                key={i}
                className="homeluxe-letter"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {ch}
              </span>
            ))}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {[
                ["", "All"],
                ["house", "Cottage"],
                ["apartment", "Mini home"],
                ["villa", "Eco villa"],
              ].map(([value, label]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setType(value)}
                  className={`rounded-full px-4 py-1.5 text-sm ${
                    form.type === value
                      ? "bg-white text-slate-900"
                      : "bg-white/25 text-white backdrop-blur"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="hidden text-sm font-semibold tracking-[0.25em] text-white sm:block">
              HOMELUXE
            </span>
          </div>
        </div>
      </section>

      <section id="search" className="relative z-10 mx-auto max-w-6xl px-4 sm:-mt-10 sm:px-6">
        <div className="rounded-2xl bg-white p-4 shadow-search">
          <div className="mb-4 flex gap-2">
            {["buy", "rent", "sell"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${
                  tab === t ? "bg-navy-700 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-6">
            <label className="md:col-span-2">
              <span className="mb-1 block text-xs font-semibold text-slate-500">Location</span>
              <input
                className="input"
                placeholder="City, Neighborhood, or ZIP"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-semibold text-slate-500">Property Type</span>
              <select
                className="input"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="">Any Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="room">Room</option>
                <option value="studio">Studio</option>
                <option value="villa">Villa</option>
              </select>
            </label>
            <label>
              <span className="mb-1 block text-xs font-semibold text-slate-500">Min rent</span>
              <input
                className="input"
                type="number"
                placeholder="₹Min"
                value={form.minRent}
                onChange={(e) => setForm({ ...form, minRent: e.target.value })}
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-semibold text-slate-500">Max rent</span>
              <input
                className="input"
                type="number"
                placeholder="₹Max"
                value={form.maxRent}
                onChange={(e) => setForm({ ...form, maxRent: e.target.value })}
              />
            </label>
            <div className="flex items-end">
              <button className="btn-primary w-full" onClick={() => load()} type="button">
                Search Properties
              </button>
            </div>
          </div>
          <div className="mt-3 max-w-xs">
            <label>
              <span className="mb-1 block text-xs font-semibold text-slate-500">Beds</span>
              <input
                className="input"
                placeholder="Any"
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
              />
            </label>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-6 pt-20 sm:px-6 md:grid-cols-4">
        {[
          ["Find The Perfect Home", "Browse thousands of verified listings that match your needs."],
          ["Expert Agents", "Work with experienced agents who guide you at every step."],
          ["Trusted & Secure", "Transparent process and secure property transactions."],
          ["Best Deals", "Get the best value with exclusive property deals."],
        ].map(([t, d]) => (
          <div
            key={t}
            className="group rounded-2xl p-6 text-center transition duration-300 hover:-translate-y-2 hover:bg-slate-50 hover:shadow-lg"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-navy-700 text-white transition duration-300 group-hover:scale-110">
              ⌂
            </div>
            <h3 className="text-sm font-bold text-navy-900">{t}</h3>
            <p className="mt-1 text-sm text-slate-500">{d}</p>
          </div>
        ))}
      </section>

      <section id="listings" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="eyebrow">Featured Properties</p>
            <h2 className="mt-1 text-3xl font-extrabold text-navy-900">Homes You'll Love</h2>
          </div>
          <span className="text-sm text-slate-500">{data.total} results</span>
        </div>
        {loading ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-10 text-center text-slate-500">
            Loading properties…
          </div>
        ) : data.properties.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.properties.map((p, i) => (
              <PropertyCard key={p._id} p={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-10 text-center text-slate-500">
            No published properties found. Try another filter.
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="overflow-hidden rounded-2xl bg-navy-900 text-white md:grid md:grid-cols-2">
          <div className="p-8 sm:p-10">
            <h2 className="text-3xl font-extrabold">Thinking of Selling?</h2>
            <p className="mt-2 max-w-sm text-white/70">Get Maximum Value for Your Property</p>
            <p className="mt-3 max-w-md text-sm text-white/60">
              Our expert agents help you sell faster and for the best possible price.
            </p>
            <Link
              className="mt-6 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-navy-800"
              to="/properties/new"
            >
              Get Free Home Valuation →
            </Link>
          </div>
          <div className="relative min-h-[240px]">
            <img src="/images/interior.jpg" alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="eyebrow">Why Choose Us</p>
        <h2 className="mt-1 text-3xl font-extrabold text-navy-900">We Make Real Estate Simple</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-4">
          {[
            ["Local Expertise", "In-depth knowledge of local markets and neighborhoods."],
            ["Personalized Service", "Tailored solutions that fit your unique needs."],
            ["Proven Results", "A track record of successful sales and happy clients."],
            ["Full Support", "From search to closing, we're with you all the way."],
          ].map(([t, d]) => (
            <div
              key={t}
              className="rounded-xl p-4 transition duration-300 hover:-translate-y-1 hover:bg-slate-50"
            >
              <h3 className="font-bold text-navy-900">{t}</h3>
              <p className="mt-1 text-sm text-slate-500">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
