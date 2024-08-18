const express = require("express");
const {
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  createUser,
  loginUser,
  signupUser,
  sessionInfo,
  logoutUser,
  getAuthStatus,
  getRecipeRecommendations,
} = require("../controllers/userController");

const router = express.Router();
const User = require("../models/userModel");

require("dotenv").config({ path: "./.env" });

/*
  Get all user data from the database.
*/
router.get("/", getUsers);
/*
  Get the recipe recommendations.
*/
router.post("/recommendations", getRecipeRecommendations);
/*
  Get the session information. 
*/
router.get("/session", sessionInfo);

/*
  Get the authentication status.
*/
router.get("/getAuthStatus", getAuthStatus);

/*
  Tet the data of the specified user.
*/
router.get("/:username", getUser);

/*
  Route for logging-in.
*/
router.post(`/login`, loginUser);

/*
  Delete the specified recipe.
*/
router.post("/", createUser);

/*
  Route for signing-up.
*/
router.post("/signup", signupUser);

/*
  Update the specified user.
*/
router.patch("/:username", updateUser);

/*
  Route for logging-out.
*/
router.delete("/logout", logoutUser);

/*
  Delete the specified user.
*/
router.delete("/:username", deleteUser);

module.exports = router;
