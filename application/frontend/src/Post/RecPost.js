import React, { useState, useEffect, useContext } from "react";
import "../Styles/ViewPost.css";
import { retrieveRecipe } from "../RecipeRecommender/RecommenderService";
import { useLocation } from "react-router-dom";

function ViewPost() {
  const location = useLocation();
  const recipeId = location.state?.state.recipeId;
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    async function loadRecipeDetail() {
      try {
        const fetchedRecipe = await retrieveRecipe(recipeId);
        setRecipe(fetchedRecipe);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError("Could not fetch recipe details. Please try again later.");
      }
    }

    loadRecipeDetail();
  }, [recipeId]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!recipe) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="view-post-container">
      <h1 className="recipe-title">{recipe.title}</h1>
      <img src={recipe.image} alt={recipe.title} />
      <h2>Ingredients</h2>
      <ul className="ingredients-list">
        {recipe.extendedIngredients &&
          recipe.extendedIngredients.map((ingredient, index) => (
            <li key={index}>{ingredient.original}</li>
          ))}
      </ul>
      <h2>Directions</h2>
      <ol className="directions-list">
        {recipe.analyzedInstructions[0].steps.map((step, index) => (
            <li key={index}>{step.step}</li>
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
        <span>Prep Time: {recipe.preparationMinutes === -1 ? 0 : recipe.preparationMinutes} minutes</span>
        <span>Cook Time: {recipe.cookingMinutes === -1 ? 0 : recipe.cookingMinutes} minutes</span>
        <span>Total Time: {recipe.readyInMinutes} minutes</span>
      </div>
    </div>
  );
}

export default ViewPost;
