const express = require("express");
const {
  createRecipe,
  getRecipes,
  getRecipe,
  deleteRecipe,
  updateRecipe,
  searchRecipes,
  toggleLike,
  searchTags
  
} = require("../controllers/recipeController");

const router = express.Router();

require("dotenv").config();
({ path: "./.env" });

/*
  Get all data of the recipes from the database.
*/
router.get("/", getRecipes);

/*
  Search for the recipe using the search term.
*/
router.get("/search/:term", searchRecipes);

/*
  Search for the recipe using the tag.
*/
router.get("/searchtag/:term", searchTags);

/*
  Get the data of a single specified recipe
*/
router.get("/:id", getRecipe);

/*
  Add a new recipe to the database.
*/
router.post("/", createRecipe);

router.post("/:id/like" , toggleLike);


/*
  Update the specified recipe.
*/
router.patch("/:id", updateRecipe);

/*
  Delete the specified recipe.
*/
router.delete("/:id", deleteRecipe);

router.delete("/:id/like" , toggleLike);

module.exports = router;
