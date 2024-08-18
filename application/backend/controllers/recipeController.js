const Recipe = require("../models/recipeModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

/*
  Get all recipes from the database.
*/
const getRecipes = async (req, res) => {
  const recipes = await Recipe.find({}).sort({ likes: -1 });
  res.status(200).json({ recipes });
};

/*
  Get a specified recipe from the database.
*/
const getRecipe = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such recipe" });
  }
  const recipe = await Recipe.findById(id);
  if (!recipe) {
    return res.status(404).json({ error: "No such recipe" });
  }
  res.status(200).json({ recipe });
};

/*
  Add a new recipe into the database.
*/
const createRecipe = async (req, res) => {
  const {
    recipeName,
    description,
    ingredients,
    directions,
    servings,
    yieldIngredients,
    prepTime,
    cookTime,
    totalTime,
    notes,
    image,
    tags
  } = req.body;
  try {
    const createdBy = req.session.user.username;
    const recipe = await Recipe.create({
      recipeName,
      description,
      ingredients,
      directions,
      servings,
      yieldIngredients,
      prepTime,
      cookTime,
      totalTime,
      notes,
      image,
      tags,
      createdBy,
    });
    res.status(200).json({ recipe });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/*
  Delete a specified recipe.
*/
const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such recipe" });
  }
  const recipe = await Recipe.findOneAndDelete({ _id: id });
  if (!recipe) {
    return res.status(404).json({ error: "No such recipe" });
  }
  res.status(200).json({ recipe });
};

/*
  Update a single recipe.
*/
const updateRecipe = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such recipe" });
  }
  const recipe = await Recipe.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
  );
  if (!recipe) {
    return res.status(404).json({ error: "No such recipe" });
  }
  res.status(200).json({ recipe });
};

/*
  Search a recipe in the database. 
*/
const searchRecipes = async (req, res, next) => {
  const { term } = req.params;

  // Case-insensitive search using regular expression
  const searchRegex = new RegExp(term, "i");

  try {
    const recipes = await Recipe.find({
      $or: [{ recipeName: searchRegex }, { description: searchRegex }],
    }).sort({ createdAt: -1 }); // Sort by creation date (descending)

    if (recipes.length > 0) {
      res.status(200).json({ recipes });
    } else {
      res.status(200).json({ recipes: [] }); // Sending an empty array as response when no recipes found
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const searchTags = async (req, res, next) => {
  const { term } = req.params;

  // Case-insensitive search using regular expression
  const searchRegex = new RegExp(term, "i");

  try {
    const recipes = await Recipe.find({
      tags:{$in:[searchRegex]}
    }).sort({ createdAt: -1 }); // Sort by creation date (descending)

    if (recipes.length > 0) {
      res.status(200).json({ recipes });
    } else {
      res.status(200).json({ recipes: [] }); // Sending an empty array as response when no recipes found
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const toggleLike = async (req, res) => {
  const { id } = req.params;
  const { liked, username } = req.body;
  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const userIndex = recipe.likes.indexOf(username);
    if (liked && userIndex === -1) {
      // Like the recipe
      recipe.likes.push(username);
    } else if (!liked && userIndex !== -1) {
      // Unlike the recipe
      recipe.likes.splice(userIndex, 1); // Remove the element at userIndex
    }

    await recipe.save(); // Save the changes to the database
    res.status(200).json({ message: 'Toggle successful' });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



/*
  Export functions.
*/
module.exports = {
  createRecipe,
  getRecipes,
  getRecipe,
  deleteRecipe,
  updateRecipe,
  searchRecipes,
  toggleLike,
  searchTags
};
