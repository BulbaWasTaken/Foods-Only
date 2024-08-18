import React, { useState, useEffect } from "react";
import { fetchRecipes, addRecipe } from "./recipeService.js";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../Helper/auth";
import { Link } from "react-router-dom";
import "../Styles/Recipes.css";
import { RECIPES } from "../Helper/APIs.js";

const CLOUDINARY_NAME = process.env.REACT_APP_CLOUDINARY_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

function Recipes() {
  const [newRecipe, setNewRecipe] = useState({
    /* State for managing the details of a new recipe */
    recipeName: "",
    description: "",
    ingredients: [""],
    directions: [""],
    servings: "",
    yieldIngredients: "",
    prepTime: 0,
    cookTime: 0,
    totalTime: 0,
    notes: "",
    image: "",
    tags: [""],
  });
  const [image, setImage] = useState("");

  /* State for storing submitted recipes */
  const [submittedRecipes, setSubmittedRecipes] = useState([]);
  const navigate = useNavigate();

  /* Handle input changes in the recipe form */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewRecipe((prev) => ({ ...prev, [name]: value }));
  };

  /* Handle deletion of a recipe */
  const handleDeleteRecipe = (index) => {
    const newRecipes = submittedRecipes.filter((_, i) => i !== index);
    setSubmittedRecipes(newRecipes);
  };

  /* Effect to check authentication status and navigate accordingly */
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const authent = await isAuthenticated();
        if (!authent) {
          navigate("/login");
        } else {
          navigate("/addrecipe");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    fetchAuthStatus();
  }, [navigate]);

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

  const imageUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", CLOUDINARY_NAME);
    return fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`,
      {
        method: "post",
        body: data,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  /* Handle the submission of a new recipe */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const uploadedImage = await imageUpload(image);
      newRecipe.image = uploadedImage.secure_url;
      const addedRecipe = await addRecipe(newRecipe);
      const response = await fetchRecipes();
      if (response.recipes && response.recipes.length > 0) {
        setSubmittedRecipes(response.recipes);
      } else {
        console.log("No recipes found.");
      }
      console.log("Added recipe:", addedRecipe.recipe._id);
      navigate(`/recipe/${addedRecipe.recipe._id}`);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting recipe:", error);
    }

    /* Reset the form regardless of success or failure */

  };

  /* Handle changes to the ingredients array */
  function handleIngredientsChange(index, value) {
    const updatedIngredients = [...newRecipe.ingredients];
    updatedIngredients[index] = value;
    setNewRecipe(prev => ({
        ...prev,
        ingredients: updatedIngredients
    }));
}

  /* Handle changes to the directions array */
  function handleDirectionsChange(index, value) {
    const updatedDirections = [...newRecipe.directions];
    updatedDirections[index] = value;
    setNewRecipe(prev => ({
        ...prev,
        directions: updatedDirections
    }));
}

  /* Handle changes to the tags array */
  function handleTagsChange(index, value) {
    const updatedTags = [...newRecipe.tags];
    updatedTags[index] = value;
    setNewRecipe(prev => ({
        ...prev,
        tags: updatedTags
    }));
}


  /* Function to add a new ingredient input field */
  function addIngredientField() {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ""]
    }));
  }

  /* Function to add a new direction input field */
  function addDirectionField() {
    setNewRecipe(prev => ({
      ...prev,
      directions: [...prev.directions, ""]
  }));
  }

  /* Function to add a new tag input field */
  function addTagField() {
    setNewRecipe(prev => ({
      ...prev,
      tags: [...prev.tags, ""]
  }));
  }

  function removeIngredientField(index) {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
  }));
  }

  function removeDirectionField(index) {
    setNewRecipe(prev => ({
      ...prev,
      directions: prev.directions.filter((_, i) => i !== index)
  }))
  }

  function removeTagField(index) {
    setNewRecipe(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
  }));
  }



  /* Calculate total time for the recipe and log it */
  useEffect(() => {
    const total =
      parseInt(newRecipe.prepTime || 0) + parseInt(newRecipe.cookTime || 0);
    setNewRecipe((prev) => ({ ...prev, totalTime: total }));
    console.log(`Total time: ${total} minutes`);
  }, [newRecipe.prepTime, newRecipe.cookTime]);

  /* Prints out the recipe form */


  return (
    <div className="recipes-container">
      <div className="recipe-form-container">
        <form onSubmit={handleSubmit} className="recipe-form">
          <h2>Add a Recipe</h2>
          <div className="update-profile-photo">
            <span>Upload Image *</span>
            <input type="file" required onChange={(e) => setImage(e.target.files[0])} />
          </div>

          <div className="form-row">
            <div className="input-field">
              <label htmlFor="recipeName">Recipe Title *</label>
              <input
                type="text"
                id="recipeName"
                name="recipeName"
                value={newRecipe.recipeName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="input-field">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={newRecipe.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div className="input-field">
            <label htmlFor="ingredients">Ingredients *</label>
            {newRecipe.ingredients.map((ingredient, index) => (
              <div key={index} className="input-with-button">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientsChange(index, e.target.value)}
                  placeholder="e.g., 2 cups flour, sifted"
                  required
                />
                <button type="button" onClick={() => removeIngredientField(index)} className="minus-btn" disabled={newRecipe.ingredients.length === 1}>-</button>
                <button type="button" onClick={addIngredientField} className="plus-btn">+</button>
              </div>
            ))}
          </div>

          <div className="input-field">
            <label htmlFor="directions">Directions *</label>
            {newRecipe.directions.map((direction, index) => (
              <div key={index} className="input-with-button">
                <textarea
                  value={direction}
                  onChange={(e) => handleDirectionsChange(index, e.target.value)}
                  rows="2"
                  placeholder="e.g., Preheat oven to 350 degrees F"
                  required
                />
                <button type="button" onClick={() => removeDirectionField(index)} className="minus-btn" disabled={newRecipe.directions.length === 1}>-</button>
                <button type="button" onClick={addDirectionField} className="plus-btn">+</button>
              </div>
            ))}
          </div>

          <div className="input-field">
            <label htmlFor="tags">Tags *</label>
            {newRecipe.tags.map((tag,index) => (
              <div key={index} className="input-with-button">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagsChange(index, e.target.value)}
                  placeholder="e.g., Vegetarian, Easy"
                  required
                />
                <button type="button" onClick={() => removeTagField(index)} className="minus-btn" disabled={newRecipe.tags.length === 1} >-</button>
                <button type="button" onClick={addTagField} className="plus-btn">+</button>
              </div>
            ))}
          </div>

          <div className="form-row">
            <div className="input-field half-width">
              <label htmlFor="servings">Servings *</label>
              <input
                type="number"
                id="servings"
                name="servings"
                value={newRecipe.servings}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-field half-width">
              <label htmlFor="yieldIngredients">Yield (Optional)</label>
              <input
                type="text"
                id="yieldIngredients"
                name="yieldIngredients"
                value={newRecipe.yieldIngredients}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-field third-width">
              <label htmlFor="prepTime">Prep Time(min) *</label>
              <input
                type="number"
                id="prepTime"
                name="prepTime"
                required
                value={newRecipe.prepTime}
                onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
                onChange={handleInputChange}
                min={0}
              />
            </div>
            <div className="input-field third-width">
              <label htmlFor="cookTime">Cook Time(min) *</label>
              <input
                type="number"
                id="cookTime"
                name="cookTime"
                value={newRecipe.cookTime}
                onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
                onChange={handleInputChange}
                min={0}
              />
            </div>
            <div className="input-field third-width">
              <label>Total Time: {newRecipe.totalTime} minutes</label>
            </div>
          </div>

          <div className="input-field">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows="4"
              value={newRecipe.notes}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              Submit Recipe
            </button>
          </div>
        </form>
      </div>
        <div className="subRecipe">
      <Link style={{textDecoration: "none"}} to="/submitted-recipes" className="view-submitted-recipes-button">View Submitted Recipes</Link>
      </div>
    </div>
  );
  
}

export default Recipes;
