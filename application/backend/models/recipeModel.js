/*
  Model for recipe information.
*/
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recipeSchema = new Schema(
  {
    recipeName: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    ingredients: [
      {
        type: String,
        required: true,
      },
    ],

    directions: [
      {
        type: String,
        required: true,
      },
    ],

    servings: {
      type: Number,
      required: true,
    },

    yieldIngredients: {
      type: String,
      required: false,
    },

    prepTime: {
      type: String,
      required: true,
    },

    cookTime: {
      type: String,
      required: true,
    },

    totalTime: {
      type: String,
      requried: false,
    },

    notes: {
      type: String,
      required: false,
    },

    image: {
      type: String,
      required: false,
    },

    createdBy: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        required: false,
      },
    ],
    likes: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Recipe", recipeSchema);
