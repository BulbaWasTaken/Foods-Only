import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../Styles/Recipes.css";
import { fetchRecipes } from "./recipeService";

function SubmittedRecipes() {
    const [submittedRecipes, setSubmittedRecipes] = useState([]);

    /* Effect to load recipes from the database */
    useEffect(() => {
        const loadRecipes = async () => {
            try {
                const response = await fetchRecipes();
                const recipes = response.recipes;
                if (Array.isArray(recipes) && recipes.length > 0) {
                    setSubmittedRecipes(recipes);
                } else {
                    console.log("No recipes found.");
                }
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        };
        loadRecipes();
    }, []);

    return (
        <div className="submitted-recipes">
        <h2>Submitted Recipes</h2>
        {submittedRecipes.length > 0 ? (
            submittedRecipes.map((recipe, index) => (
                <div key={recipe._id} className="recipe-card">
                    <h3>{recipe.recipeName}</h3>
                    <p><strong>Description:</strong> {recipe.description}</p>
                    <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
                    <p><strong>Directions:</strong> {recipe.directions.join(", ")}</p>
                    <p><strong>Tags:</strong> {recipe.tags.join(", ")}</p>
                    <p><strong>Servings:</strong> {recipe.servings}</p>
                    <p><strong>Yield:</strong> {recipe.yieldIngredients}</p>
                    <p><strong>Prep Time:</strong> {recipe.prepTime} minutes</p>
                    <p><strong>Cook Time:</strong> {recipe.cookTime} minutes</p>
                    <p><strong>Total Time:</strong> {recipe.totalTime} minutes</p>
                    <p><strong>Notes:</strong> {recipe.notes}</p>
                    <Link to={`/recipe/${recipe._id}`} className="view-recipe-button">View Recipe</Link>
                </div>
            ))
        ) : (
            <p>No recipes found.</p>
        )}
    </div>
    );
}

export default SubmittedRecipes;
