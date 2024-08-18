import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchRecipes } from "../Recipes/recipeService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as fasBookmark } from "@fortawesome/free-solid-svg-icons";
import axios, { apis } from "../Helper/axiosInstance";
import { isAuthenticated } from "../Helper/auth";
import "../Styles/ViewPost.css";
const header = 'Bearer ' + process.env.REACT_APP_API_KEY;

function ViewPost() {
  const { recipeId, profileId } = useParams();
  const [liked, setLiked] = useState();
  const [bookmarked, setBookmarked] = useState();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const [numLikes, setNumLikes] = useState(0);

  useEffect(() => {
    async function loadRecipeDetail() {
      try {
        const allRecipes = await fetchRecipes();
        console.log("All recipes fetched:", allRecipes.recipes);
        console.log(
          "Available recipe IDs:",
          allRecipes.recipes.map((r) => r._id),
        );

        if (allRecipes && allRecipes.recipes.length) {
          const foundRecipe = allRecipes.recipes.find(
            (r) => r._id === recipeId,
          );
          if (foundRecipe) {
            setRecipe(foundRecipe);
            setNumLikes(foundRecipe.likes.length);
            // Check if the current user's username exists in the likes array
            const auth = await isAuthenticated();
            if (auth) {
              const sessionInfo = await axios.get(apis.USERS + "/session");
              const username = sessionInfo.data.username;
              if (foundRecipe.likes.includes(username)) {
                setLiked(true);
              }
            }
          } else {
            console.error("No recipe matches the ID:", recipeId);
            setError("Recipe not found.");
          }
        } else {
          console.error(
            "No recipes available or incorrect data structure:",
            allRecipes,
          );
          setError("Failed to load recipes or invalid recipe data structure.");
        }
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError("Could not fetch recipe details. Please try again later.");
      }
    }

    loadRecipeDetail();
  }, [recipeId]);

  useEffect(() => {
    async function checkBookmarked() {
      const authStatus = await isAuthenticated();
      if (authStatus) {
        const sessionInfo = await axios.get(apis.USERS + "/session");
        const username = sessionInfo.data.username;
        try {
          const profileResponse = await axios.get(`${apis.PROFILES}/${username}`, {
            headers: { 'Authorization': header }
          });
          if (profileResponse.data.profile.bookmarks.includes(recipeId)) {
            setBookmarked(true);
          } else {
            setBookmarked(false);
          }
        } catch (error) {
          console.error("Failed to fetch bookmarks:", error);
        }
      }
    }
  
    checkBookmarked();
  }, [recipeId]); 
  

  

  const toggleLike = () => {
    setLiked((prevLiked) => {
      addLike(!prevLiked); // Log the updated value
      return !prevLiked; // Return the new value
    });
  };

  const addLike = async (prevLiked) => {
    const auth = await isAuthenticated();
    if (auth) {
      const sessionInfo = await axios.get(apis.USERS + "/session");
      const username = sessionInfo.data.username;
      try {
        const response = await fetch(apis.RECIPES + `/${recipeId}/like`, {
          method: prevLiked ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': header,
          },
          body: JSON.stringify({ liked: prevLiked, username }),
        });
        if (response.ok) {
          setNumLikes(prevNumLikes => liked ? prevNumLikes - 1 : prevNumLikes + 1);
          setLiked(!liked);
        } else {
          console.error('Failed to toggle like');
        }
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    }
  }

  const toggleBookmark = () => {
    setBookmarked(prevBookmarked => {
      updateBookmark(!prevBookmarked);  // Toggle the current state and update the backend
      return !prevBookmarked;  // Return the new state
    });
  };
  


  const updateBookmark = async (newBookmarkStatus) => {
    const auth = await isAuthenticated();
    if (auth) {
        const sessionInfo = await axios.get(apis.USERS + "/session");
        const username = sessionInfo.data.username;

        console.log(`Attempting to ${newBookmarkStatus ? 'add' : 'remove'} bookmark for user: ${username}`);

        try {
            const response = await fetch(apis.PROFILES + `/${recipeId}/bookmark`, {
                method: newBookmarkStatus ? 'POST' : 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': header,
                },
                body: JSON.stringify({ username:username }),
            });

            if (response.ok) {
                console.log(`Bookmark ${newBookmarkStatus ? 'added' : 'removed'} successfully.`);
                setBookmarked(newBookmarkStatus);
            } else {
                console.log(`Failed to ${newBookmarkStatus ? 'add' : 'remove'} bookmark. Response status: ${response.status}`);
                throw new Error('Failed to toggle bookmark');
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    } else {
        console.log('User not authenticated.');
    }
};

  

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!recipe) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="view-post-container">
      <h1 className="recipe-title">{recipe.recipeName}</h1>
      <div className="icons">
        <FontAwesomeIcon
          icon={liked ? fasHeart : farHeart}
          onClick={toggleLike}
          className={`icon ${liked ? "liked" : ""}`}
          style={{ color: liked ? "red" : "gray", cursor: "pointer" }}
        />
        <span>{numLikes}</span> {/* Display the number of likes */}
        <FontAwesomeIcon
          icon={bookmarked ? fasBookmark : farBookmark}
          onClick={toggleBookmark}
          className={`icon ${bookmarked ? "bookmarked" : ""}`}
          style={{ color: bookmarked ? "gold" : "gray", cursor: "pointer" }}
        />
      </div>
      <p className="recipe-description">{recipe.description}</p>
      <h2>Ingredients</h2>
      <ul className="ingredients-list">
        {recipe.ingredients &&
          recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
      </ul>
      <h2>Directions</h2>
      <ol className="directions-list">
        {recipe.directions &&
          recipe.directions.map((direction, index) => (
            <li key={index}>{direction}</li>
          ))}
      </ol>
      {recipe.notes && (
        <>
          <h2>Notes</h2>
          <p className="recipe-notes">{recipe.notes}</p>
        </>
      )}
      <div className="recipe-meta">
        <span>Servings: {recipe.servings}</span>
        <span>Prep Time: {recipe.prepTime} minutes</span>
        <span>Cook Time: {recipe.cookTime} minutes</span>
        <span>Total Time: {recipe.totalTime} minutes</span>
      </div>
    </div>
  );
}

export default ViewPost;
