import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios, { apis } from "../Helper/axiosInstance";
import "../Styles/Login_Signup.css";
import "../Styles/UserProfile.css";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }

    /* 
      Fetch recipes when the component mounts or searchTerm changes
    */
    if (searchTermFromUrl.startsWith("@")) {
      fetchUser(searchTermFromUrl.substring(1));
    }else if(searchTermFromUrl.startsWith("#")){
      fetchTag(searchTermFromUrl.substring(1));
    } else {
      fetchRecipe(searchTermFromUrl);
    }
    return () => {
      setSearchTerm(""); // This will clear the searchTerm when the component unmounts
    };
  }, [location.search, searchTerm]);

  const fetchRecipe = async (term) => {
    try {
      const response = await axios.get(apis.RECIPES + `/search/${term}`);
      const data = await response.data;
      /* 
        Filter recipes based on the searchTerm
      */
      const filteredRecipes = data.recipes.filter((recipe) =>
        recipe.recipeName.toLowerCase().includes(term.toLowerCase()),
      );
      setRecipes(filteredRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const fetchTag = async (term) => {
    try {
      const response = await axios.get(apis.RECIPES + `/searchtag/${term}`);
      const data = await response.data;
      /* 
        Filter recipes based on the searchTerm
      */
      const filteredRecipes = data.recipes.filter((recipe) =>
        recipe.recipeName.toLowerCase().includes(term.toLowerCase()),
      );
      setRecipes(filteredRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const fetchUser = async (term) => {
    try {
      const response = await axios.get(apis.PROFILES + `/search/${term}`);
      const data = await response.data;
      /* 
        Filter recipes based on the searchTerm
      */
      const filteredRecipes = data.profiles.filter((profile) =>
        profile.username.toLowerCase().includes(term.toLowerCase()),
      );
      setProfiles(filteredRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  return (
    <div className="searchPage">
      <div className="searchResult">
        <h1>Search Results for "{searchTerm}"</h1>
        <div className="recipe-cards-container">
          {searchTerm.startsWith("@")
            ? profiles.map((profile) => (
                <Link style={{textDecoration: "none"}}
                  key={profile.username}
                  to={`/profile/${profile.username}`}
                >
                  <div className="recipe-card">
                    <div className="profile-image">
                      {profile.profileImage && (
                        <img
                          src={profile.profileImage}
                          alt={profile.username}
                        />
                      )}
                    </div>
                    <h2>{profile.username}</h2>
                    <h4>{profile.bio}</h4>
                    {/* Add other details such as recipe image, ingredients, etc. */}
                  </div>
                </Link>
              ))
            : recipes.map((recipe) => (
                <Link style={{textDecoration: "none"}} key={recipe._id} to={`/recipe/${recipe._id}`}>
                  <div key={recipe._id} className="recipe-card">
                    <h2 >{recipe.recipeName}</h2>
                    <h4>{recipe.description}</h4>
                    {/* Add other details such as recipe image, ingredients, etc. */}
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
