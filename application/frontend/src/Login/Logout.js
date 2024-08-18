import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../Helper/auth";
import axios from "../Helper/axiosInstance";

const API_URL = process.env.REACT_APP_API_URL + "/api/users";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.delete(API_URL + "/logout");
        navigate("/");
        window.location.reload();
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    if (isAuthenticated()) {
      logout();
    } else {
      navigate("/");
      window.location.reload();
    }
  }, [navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
