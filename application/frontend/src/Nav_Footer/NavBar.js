import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../Helper/auth";
import axios, { apis } from "../Helper/axiosInstance";
import "../Styles/NavBar.css";

function NavBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const authent = await isAuthenticated();
        setLoggedIn(authent);
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    fetchAuthStatus();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      const fetchProfile = async () => {
        try {
          const sessionInfo = await axios.get(apis.USERS + "/session");
          const user = sessionInfo.data.username;
          const response = await axios.get(apis.PROFILES + `/${user}`);
          const data = response.data;
          setProfile(data.profile);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
      fetchProfile();
    }
  }, [loggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    window.location.reload();
  };

  const handleAISearch = (e) => {
    setIsDropdownVisible(false);
    navigate("/recommended", { state: { searchTerm } });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleProfileClick = () => {
    if (profile) {
      navigate(`/profile/${profile.username}`);
      window.location.reload();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setSearchTerm("")}>
          FOODS ONLY
        </Link>
        <div className="navbar-search">
          <form onSubmit={handleSubmit} className="searchForm">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onFocus={() => setIsDropdownVisible(true)}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>
        </div>
        <div className="navbar-links">
          <Link to="/" className="nav-link" onClick={() => setSearchTerm("")}>
            Home
          </Link>
          {loggedIn ? (
            <Link
              to="addrecipe"
              className="nav-link"
              onClick={() => setSearchTerm("")}
            >
              Add-Recipe
            </Link>
          ) : (
            <Link
              to="login"
              className="nav-link"
              onClick={() => setSearchTerm("")}
            >
              Add-Recipe
            </Link>
          )}
          <div className="navbar-account">
            {loggedIn ? (
              <>
                <div onClick={handleProfileClick} className="nav-link-profile">
                  {profile && profile.profileImage && (
                    <img
                      src={profile.profileImage}
                      alt={profile.username}
                      className="nav-avatar"
                    />
                  )}
                  <span className="nav-avatar-name">
                    {profile && profile.username}
                  </span>
                </div>
                <Link to="logout" className="nav-link">
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="signup"
                  className="nav-link"
                  onClick={() => setSearchTerm("")}
                >
                  Sign Up
                </Link>
                <Link
                  to="login"
                  className="nav-link"
                  onClick={() => setSearchTerm("")}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {isDropdownVisible && (
        <div className="dropdown-menu" ref={dropdownRef}>
          <h2>Use "@" to search for users</h2>
          {loggedIn ? (
            <button type="button" onClick={handleAISearch}>
              Search with AI
            </button>
          ) : (
            <Link to="/login">
              <button type="button" onClick={() => setIsDropdownVisible(false)}>
                Login to Search with AI
              </button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
