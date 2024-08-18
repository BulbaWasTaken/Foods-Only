import React, { useState, useEffect, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { retrieveRecomendations } from "./RecommenderService.js";
import { isAuthenticated } from "../Helper/auth";
import axios, { apis } from "../Helper/axiosInstance";
import "../Styles/RecipeRecommender.css";
import "react-toastify/dist/ReactToastify.css";

function RecipeRecommender() {
  const location = useLocation();
  const searchTerm = location.state?.searchTerm;
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [username, setUsername] = useState("");
  const [skill, setSkill] = useState("");
  const [isInfoFetched, setIsInfoFetched] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      const auth = await isAuthenticated();
      if (auth) {
        const sessionInfo = await axios.get(apis.USERS + "/session");
        const user = sessionInfo.data.username;
        const response = await axios.get(apis.PROFILES + `/${user}`);
        const data = response.data;
        setPreferences(
          data.profile.foodPreference ? data.profile.foodPreference : "nothing"
        );
        setAllergies(
          data.profile.allergies ? data.profile.allergies : "nothing"
        );
        setUsername(user);
        setSkill(data.profile.cookingExperience);
        setIsInfoFetched(true);
      }
    };
    fetchInfo();
  }, []);

  useEffect(() => {
    const getRecommendations = async () => {
      if (isInfoFetched && searchTerm && preferences && allergies && skill) {
        const recipes = await retrieveRecomendations(
          searchTerm,
          preferences,
          allergies,
          skill
        );
        setRecommendedRecipes(recipes);
      }
    };
    getRecommendations();
  }, [searchTerm, preferences, allergies]);

  useEffect(() => {
    if (recommendedRecipes.length > 0) {
      toast(
        `Hi ${username}! I'm your helpful AI.
      Here are some results for ${searchTerm} that I found. I hand picked them based on your allergies of
      ${allergies} and food preferences for ${preferences}. Put those ${skill} skills to use!`,
        { autoClose: false, position: "bottom-left", closeButton: false }
      );
    }
  }, [recommendedRecipes]);

  return (
    <div className="recommended">
      <h3>Recommended Recipes</h3>
      <div className="search-recipe-list">
        {recommendedRecipes.map((recipe, index) => (
          <div className="search-recipe-card" key={index}>
            <Link
              to={"/recommendedrecipe"}
              state={{ state: { recipeId: recipe.id } }}
            >
              <p>{recipe.title}</p>
              <img src={recipe.image} alt={recipe.title} />
            </Link>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}

export default RecipeRecommender;
