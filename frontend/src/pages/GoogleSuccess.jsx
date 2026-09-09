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
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Signing you in...</h2>
    </div>
  );
}