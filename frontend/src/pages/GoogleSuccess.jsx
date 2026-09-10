import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function GoogleSuccess({ onLogin }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    const userString = params.get("user");

    if (!token || !userString) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userString);
      localStorage.setItem("rentnest_token", token);
      localStorage.setItem("rentnest_user", JSON.stringify(user));
      onLogin(user);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      navigate("/login");
    }
  }, [params, navigate, onLogin]);

  return (
    <div className="px-4 py-20 text-center text-slate-600">
      <h2 className="text-2xl font-bold text-navy-900">Signing you in...</h2>
    </div>
  );
}
