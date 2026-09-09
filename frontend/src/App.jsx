import React, { useEffect, useState } from "react";

import {
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";
import GoogleSuccess from "./pages/GoogleSuccess";
import api from "./services/api";
import ProfileDropdown from "./components/ ProfileDropdown.jsx";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";
import Dashboard from "./pages/Dashboard";
import CreateProperty from "./pages/CreateProperty";
import Applications from "./pages/Applications";
import Payments from "./pages/Payments";
import Admin from "./pages/Admin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SavedProperties from "./pages/SavedProperties";
import Earnings from "./pages/Earnings";

function Nav({ user, onLogout }) {
  const nav = useNavigate();

  return (
    <header className="nav">
      <Link className="brand" to="/">
        Rent<span>Nest</span>
      </Link>

      <nav>
        <Link to="/applications">Applications</Link>
         <Link to="/payments">Payments</Link>

        <Link to="/properties">Explore</Link>

        {user?.role === "tenant" && (
          <Link to="/saved">Saved</Link>
        )}

        {user?.role === "owner" && (
          <Link to="/dashboard">
            Dashboard
          </Link>
        )}

        {user?.role === "owner" && (
          <Link to="/properties/new">
            List Property
          </Link>
        )}

        {user?.role === "owner" && (
          <Link to="/earnings">Earnings</Link>
        )}

        {user?.role === "admin" && (
          <Link to="/admin">
            Admin
          </Link>
        )}

        {user ? (
         <ProfileDropdown
    user={user}
    onLogout={() => {
      localStorage.removeItem("rentnest_token");
      localStorage.removeItem("rentnest_user");

      onLogout();

      nav("/login");
    }}
  />
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link
              className="navcta"
              to="/register"
            >
              Get started
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(
      localStorage.getItem("rentnest_user") || "null"
    )
  );
  useEffect(() => {
    const token =
      localStorage.getItem("rentnest_token");

    if (token && !user) {
      api
        .get("/auth/me")
        .then((r) => {
          setUser(r.data.user);

          localStorage.setItem(
            "rentnest_user",
            JSON.stringify(r.data.user)
          );
        })
        .catch(() => {});
    }
  }, [user]);

  return (
    <>
      <Nav
        user={user}
        onLogout={() => setUser(null)}
      />

      <main>
        <Routes>

          {/* Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* Properties */}
          <Route
            path="/properties"
            element={<Home />}
          />

          {/* Property Details */}
          <Route
            path="/properties/:id"
            element={
              <PropertyDetails user={user} />
            }
          />

          {/* Login */}
          <Route
            path="/login"
            element={
              <Login onLogin={setUser} />
            }
          />
          <Route
  path="/google-success"
  element={
    <GoogleSuccess onLogin={setUser} />
  }
/>

          {/* Register */}
          <Route
            path="/register"
            element={
              <Register onLogin={setUser} />
            }
          />

          {/* Forgot password */}
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          {/* Reset password */}
          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />

          {/* Saved Properties */}
          <Route
            path="/saved"
            element={
              user?.role === "tenant" ? (
                <SavedProperties />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Owner Earnings */}
          <Route
            path="/earnings"
            element={
              user?.role === "owner" ? (
                <Earnings />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              user ? (
                <Dashboard user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Create Property */}
          <Route
            path="/properties/new"
            element={
              user?.role === "owner" ? (
                <CreateProperty />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* EDIT PROPERTY
              Owner -> own property
              Admin -> any property
          */}
          <Route
            path="/properties/:id/edit"
            element={
              user?.role === "owner" ||
              user?.role === "admin" ? (
                <CreateProperty />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Applications */}
          <Route
            path="/applications"
            element={
              user ? (
                <Applications user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Payments */}
        <Route
  path="/payments"
  element={
    user ? (
      <Payments user={user} />
    ) : (
      <Navigate to="/login" />
    )
  }
/>

          {/* Admin */}
          <Route
            path="/admin"
            element={
              user?.role === "admin" ? (
                <Admin />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

        </Routes>
      </main>

      <footer>
        © 2026 RentNest · Built for simple,
        transparent rentals
      </footer>
    </>
  );
}