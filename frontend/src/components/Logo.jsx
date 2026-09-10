import { Link } from "react-router-dom";

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${light ? "bg-white/10 text-white" : "bg-navy-700 text-white"}`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
          <path d="M12 3.2 3.5 10.2V21h6.2v-6.3h4.6V21H20.5V10.2L12 3.2Z" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className={`block text-[15px] font-extrabold tracking-wide ${light ? "text-white" : "text-navy-900"}`}>
          HOMELUXE
        </span>
        <span className={`block text-[10px] font-medium tracking-[0.18em] uppercase ${light ? "text-white/70" : "text-slate-500"}`}>
          Real Estate
        </span>
      </span>
    </Link>
  );
}
