import React, { useState } from "react";

export default function ProfileDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-700 text-xs font-semibold text-white">
          {user.name?.charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:inline">{user.name}</span>
        <span className="text-slate-400">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-700 text-sm font-semibold text-white">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-semibold text-navy-900">{user.name}</h4>
              <span className="text-xs capitalize text-slate-500">
                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
              </span>
            </div>
          </div>

          <hr className="my-3 border-slate-100" />

          <div className="space-y-2 text-sm">
            <div>
              <strong className="block text-xs uppercase tracking-wide text-slate-400">Email</strong>
              <span className="text-slate-700">{user.email}</span>
            </div>
            <div>
              <strong className="block text-xs uppercase tracking-wide text-slate-400">Phone</strong>
              <span className="text-slate-700">{user.phone || "Not provided"}</span>
            </div>
            <div>
              <strong className="block text-xs uppercase tracking-wide text-slate-400">Role</strong>
              <span className="capitalize text-slate-700">
                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
              </span>
            </div>
          </div>

          <hr className="my-3 border-slate-100" />

          <button
            className="w-full rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
            onClick={onLogout}
            type="button"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
