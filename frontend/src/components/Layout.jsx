import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import ProfileDropdown from "./ProfileDropdown";

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition ${isActive ? "text-navy-800" : "text-slate-600 hover:text-navy-800"}`;

export default function Layout({ user, onLogout, children }) {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const logout = () => {
    localStorage.removeItem("rentnest_token");
    localStorage.removeItem("rentnest_user");
    onLogout();
    nav("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="hidden border-b border-navy-800 bg-navy-900 text-white/80 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-xs sm:px-6">
          <div className="flex items-center gap-5">
            <span>Trusted by 10,000+ Clients</span>
            <span>5 Star Rated Agency</span>
            <span>Free Property Valuation</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+18001234567">(800) 123-4567</a>
            <span className="opacity-70">f in</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo />
          <button
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm lg:hidden"
            onClick={() => setOpen((v) => !v)}
            type="button"
          >
            Menu
          </button>
          <nav className={`items-center gap-5 ${open ? "absolute left-0 right-0 top-full flex flex-col border-b border-slate-100 bg-white p-4" : "hidden lg:flex"}`}>
            <NavLink className={linkClass} to="/" end onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink className={linkClass} to="/properties" onClick={() => setOpen(false)}>Rent</NavLink>
            <NavLink className={linkClass} to="/applications" onClick={() => setOpen(false)}>Applications</NavLink>
            <NavLink className={linkClass} to="/payments" onClick={() => setOpen(false)}>Payments</NavLink>
            {user?.role === "tenant" && (
              <NavLink className={linkClass} to="/saved" onClick={() => setOpen(false)}>Saved</NavLink>
            )}
            {user?.role === "owner" && (
              <>
                <NavLink className={linkClass} to="/dashboard" onClick={() => setOpen(false)}>Dashboard</NavLink>
                <NavLink className={linkClass} to="/earnings" onClick={() => setOpen(false)}>Earnings</NavLink>
              </>
            )}
            {user?.role === "admin" && (
              <NavLink className={linkClass} to="/admin" onClick={() => setOpen(false)}>Admin</NavLink>
            )}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                {user.role === "owner" && (
                  <Link className="btn-primary" to="/properties/new">List Your Property</Link>
                )}
                <ProfileDropdown user={user} onLogout={logout} />
              </>
            ) : (
              <>
                <Link className="text-sm font-medium text-slate-600 hover:text-navy-800" to="/login">Login</Link>
                <Link className="btn-primary" to="/register">Get started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-navy-900 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-4">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs text-sm text-white/70">
              Helping you find the perfect place to call home. Your trusted real estate partner.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Quick Links</h4>
            <div className="space-y-2 text-sm text-white/70">
              <Link className="block hover:text-white" to="/">Home</Link>
              <Link className="block hover:text-white" to="/properties">Rent</Link>
              <Link className="block hover:text-white" to="/properties/new">Sell</Link>
              <Link className="block hover:text-white" to="/properties">Listings</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Company</h4>
            <div className="space-y-2 text-sm text-white/70">
              <Link className="block hover:text-white" to="/applications">Applications</Link>
              <Link className="block hover:text-white" to="/payments">Payments</Link>
              <Link className="block hover:text-white" to="/login">Login</Link>
              <Link className="block hover:text-white" to="/register">Register</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Contact Us</h4>
            <div className="space-y-2 text-sm text-white/70">
              <p>(800) 123-4567</p>
              <p>info@homeluxe.com</p>
              <p>123 Real Estate Blvd, Suite 100</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold">Stay Updated</p>
              <p className="text-xs text-white/60">Subscribe to get the latest property listings and real estate tips.</p>
            </div>
            <form
              className="flex w-full max-w-md overflow-hidden rounded-lg bg-white"
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
            >
              <input
                className="min-w-0 flex-1 px-3 py-2.5 text-sm text-slate-800 outline-none"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
              <button className="bg-navy-700 px-4 text-sm font-semibold text-white" type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
          © 2026 HomeLuxe Real Estate. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
