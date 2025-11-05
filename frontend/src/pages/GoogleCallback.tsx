import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userId = params.get("userId");
    const email = params.get("email");
    const name = params.get("name");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ userId, email, name }));
      navigate("/");
    }
  }, [location, navigate]);

  return <p>Logging you in with Google...</p>;
}
