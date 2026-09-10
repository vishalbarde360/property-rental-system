export function statusClass(status) {
  const s = String(status || "").toLowerCase();
  if (["published", "approved", "success", "active", "available", "resolved"].includes(s)) {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }
  if (["pending", "under_review", "draft", "open"].includes(s)) {
    return "bg-amber-50 text-amber-700 border-amber-100";
  }
  if (["rejected", "failed", "paused", "disabled", "unavailable"].includes(s)) {
    return "bg-rose-50 text-rose-700 border-rose-100";
  }
  return "bg-slate-50 text-slate-600 border-slate-200";
}

export function inr(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}
