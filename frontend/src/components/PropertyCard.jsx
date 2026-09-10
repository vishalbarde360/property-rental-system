import { Link } from "react-router-dom";
import { inr } from "../ui";

const FALLBACKS = ["/images/house-1.jpg", "/images/house-2.jpg", "/images/house-3.jpg", "/images/hero.jpg"];

export default function PropertyCard({ p, index = 0 }) {
  const img = p.images?.[0] || FALLBACKS[index % FALLBACKS.length];
  const badge = p.availability === false ? "UNAVAILABLE" : "FOR RENT";

  return (
    <Link
      className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
      to={`/properties/${p._id}`}
    >
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img src={img} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded bg-navy-700 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          {badge}
        </span>
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500">
          ♡
        </span>
      </div>
      <div className="space-y-2 p-4">
        <div className="text-lg font-extrabold text-navy-800">
          {inr(p.rent)}
          <small className="ml-1 text-xs font-medium text-slate-500">/mo</small>
        </div>
        <h3 className="line-clamp-1 text-[15px] font-semibold text-slate-900">{p.title}</h3>
        <p className="line-clamp-1 text-sm text-slate-500">
          {p.address ? `${p.address}, ` : ""}
          {p.city}
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-100 pt-2 text-xs text-slate-500">
          <span>{p.bedrooms} Beds</span>
          <span>{p.bathrooms} Baths</span>
          <span className="capitalize">{p.type}</span>
        </div>
      </div>
    </Link>
  );
}
