import React, { useState } from "react";
import { signupUser } from "./registerService.js";
import { makeProfile } from "../Profile/profileService.js";
import { useNavigate } from "react-router-dom";
import "../Styles/Login_Signup.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // eslint-disable-next-line no-unused-vars
  const [profile, setProfile] = useState({
    bio: "",
    cookingExperience: "",
    allergies: "",
    foodPreference: "",
    profileImage:
      "https://res.cloudinary.com/dbspkj6dy/image/upload/v1714813803/x36i4iozmkqsdpxwakq2.jpg",
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  /* 
    A function that handles the submission of the form.
    This function validates the form and then submits the form.

  */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      // Submit the form
      const newUser = { name, age, username, email, password };
      const newProfile = { username, ...profile };
      await signupUser(newUser);
      await makeProfile(newProfile);
      navigate("/login");
    }
  };
  /*
    A function that prevents the user from entering invalid age.
  */
  const handleAgeChange = (e) => {
    const ageValue = parseInt(e.target.value);
    if (!isNaN(ageValue) && ageValue >= 0) {
      setAge(ageValue);
    }
  };
  /*
    Form validation for signing up.
  */
  const validateForm = () => {
    let isValid = true;
    const errors = {
      username: "",
      password: "",
      confirmPassword: "",
    };

    if (!username.charAt(0).match(/[A-Za-z]/)) {
      errors.username = "Username must start with a letter";
      isValid = false;
    } else if (username.length < 3 || !username.match(/[A-Za-z]/)) {
      errors.username =
        "Username must be at least 3 characters long";
      isValid = false;
    }
    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
      isValid = false;
    } else if (!password.match(/[A-Z]/)) {
      errors.password = "Password must contain at least one uppercase letter";
      isValid = false;
    } else if (!password.match(/[a-z]/)) {
      errors.password = "Password must contain at least one lowercase letter";
      isValid = false;
    } else if (!password.match(/[0-9]/)) {
      errors.password = "Password must contain at least one number";
      isValid = false;
    } else if (!password.match(/[/*\-+!@#$^&~[\]]/)) {
      errors.password = "Password must contain at least one special character";
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  return (
    <div className="register-container">
      <form className="register-form" id="register" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First Last"
          />
        </div>
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          {formErrors.username && (
            <p className="error">{formErrors.username}</p>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={handleAgeChange}
            placeholder="Age"
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
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
          {formErrors.password && (
            <p className="error">{formErrors.password}</p>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
          {formErrors.confirmPassword && (
            <p className="error">{formErrors.confirmPassword}</p>
          )}
        </div>

        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
    </div>
  );
}

export default Signup;
