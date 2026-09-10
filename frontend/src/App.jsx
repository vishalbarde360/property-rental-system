import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import GoogleSuccess from "./pages/GoogleSuccess";
import api from "./services/api";
import Layout from "./components/Layout";

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

export default function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("rentnest_user") || "null"),
  );
  useEffect(() => {
    const token = localStorage.getItem("rentnest_token");

    if (token && !user) {
      api
        .get("/auth/me")
        .then((r) => {
          setUser(r.data.user);
          localStorage.setItem("rentnest_user", JSON.stringify(r.data.user));
        })
        .catch(() => {});
    }
  }, [user]);

  return (
    <Layout user={user} onLogout={() => setUser(null)}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Home />} />
        <Route path="/properties/:id" element={<PropertyDetails user={user} />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/google-success" element={<GoogleSuccess onLogin={setUser} />} />
        <Route path="/register" element={<Register onLogin={setUser} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/saved"
          element={user?.role === "tenant" ? <SavedProperties /> : <Navigate to="/login" />}
        />
        <Route
          path="/earnings"
          element={user?.role === "owner" ? <Earnings /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/properties/new"
          element={user?.role === "owner" ? <CreateProperty /> : <Navigate to="/login" />}
        />
        <Route
          path="/properties/:id/edit"
          element={
            user?.role === "owner" || user?.role === "admin" ? (
              <CreateProperty />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/applications"
          element={user ? <Applications user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/payments"
          element={user ? <Payments user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={user?.role === "admin" ? <Admin /> : <Navigate to="/login" />}
        />
      </Routes>
    </Layout>
  );
}
