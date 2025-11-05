import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setCredentials } from "../slices/authSlice";

export default function GoogleCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const token = params.get("token");
    const userId = params.get("userId");
    const email = params.get("email");
    const name = params.get("name");

    if (token && email) {
      dispatch(setCredentials({ token, user: { userId, name, email } }));
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, location.search]);

  return <p>Logging you in with Google...</p>;
}
