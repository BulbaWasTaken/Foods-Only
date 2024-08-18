import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "./loginService.js";
import "../Styles/Login_Signup.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = { username, password };
    try {
      /* 
        Submit the form to the backend
      */
      const login = await loginUser(userData);
      if(login){
        navigate(`/profile/${username}`);
        window.location.reload();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" id="register" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        <button type="submit" className="submit-button">
          Login
        </button>
        <span className="no-account-text">
          <Link to="/signup">Don't have an account? Sign Up</Link>
        </span>
      </form>
    </div>
  );
}

export default Login;
