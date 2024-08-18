const User = require("../models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const OpenAI = require("openai");

const openai = new OpenAI({apiKey: "sk-proj-2dScyZq0OTZvy4CcPaGXT3BlbkFJXXAuotxpB00vLKtcz9JJ"});

/*
  Get recipe recommendations based on user data
*/
const getRecipeRecommendations = async (req, res) => {
  const recipes = req.body.recipes;
  const preferences = req.body.preferences;
  const allergies = req.body.allergies;
  const skill = req.body.skill;
  /*
    Ensure recipes is an array and provided
  */
  if (!Array.isArray(recipes) || recipes.length === 0) {
    return res.status(400).json({ error: "Recipes not provided" });
  }
  /*
    Prepare user input for the GPT-3 model
  */
  const prompt =
    `Given the following recipes array, pick as many as possible choices for a ${skill} level cook with the ` +
    `following allergies: ${allergies}, and the following food preferences: ${preferences}. respond with ` +
    `ONLY an array as json format: "recipes: [x,x,x,x,x]"\n ${JSON.stringify(recipes)}`;
  // pass prompt to chat gpt
  try {
    // Make a request to ChatGPT to generate recipe recommendations
    const completion = await openai.chat.completions.create({
      messages: [{role: "user", content: prompt}],
      model: "gpt-4",
    });
    const response = completion.choices[0]?.message?.content;
    // Obtain recipes from the response and display them
    res.status(200).json({ response: response });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ error: "Error generating recommendations" });
  }
};

/*
  Get all users from the database.
*/
const getUsers = async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.status(200).json({ users });
};

/*
  Get the specified user from the database.
*/
const getUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: "No such user" });
  }
  res.status(200).json({ user });
};

/*
  Add a new user into the database.
*/
const createUser = async (req, res) => {
  const { name, age, username, email, password } = req.body;
  try {
    const user = await User.create({ name, age, username, email, password });
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/*
  Delete the specified user.
*/
const deleteUser = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOneAndDelete({ username });
  if (!user) {
    return res.status(404).json({ error: "No such user" });
  }
  res.status(200).json({ user });
};

/*
  Update the specified user.
*/
const updateUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such user" });
  }
  const user = await User.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
  );
  if (!user) {
    return res.status(404).json({ error: "No such user" });
  }
  res.status(200).json({ user });
};

/*
  A helper function for logging-in
*/
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ msg: "Something missing" });
  }
  /*
    Look up the user in database. If user doesn't exist, 
    return a bad request "User not found." response.
  */
  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(400).json({ msg: "User not found." });
  }

  /*
    Check if the password given matches the password in the database.
  */
  const matchPassword = await bcrypt.compare(password, user.password);
  if (matchPassword) {
    /*
      Creating user session to keep user loggedin also on refresh.
      This lasts for 3 hours.
    */
    const userSession = {
      username: user.username,
      user_id: user._id.toString(),
      id: user._id,
    };

    /*
      Attach user session to session object from express-session
    */
    req.session.user = userSession;

    /*
      Attach user session id to the response. This will turn into a cookie.
    */
    return res
      .status(200)
      .json({ msg: "You have logged in successfully", userSession });
  } else {
    return res.status(400).json({ msg: "Invalid credential" });
  }
};

/*
  A helper function for signing-up.
*/
const signupUser = async (req, res) => {
  const { username, password, email, age, name } = req.body;
  try {
    const user = await User.signup(name, username, age, email, password);
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/*
  A helper function for logging-out. This function
  destroys the session cookie made in login.
*/
const logoutUser = (req, res) => {
  req.session.destroy((error) => {
    if (error) throw error;
    res.clearCookie("session-id");
    res.status(200).send("Logout Success");
  });
};

/*
  A helper function to get the session information. 
*/
const sessionInfo = async (req, res) => {
  if (req.session.user) {
    return res.json(req.session.user);
  } else {
    return res.status(401).json("unauthorize");
  }
};

/*
  A helper function for checking the authentications status.
  Basically, this checks if the user is logged-in or not.
*/
const getAuthStatus = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(200).json({ username: null });
    }

    const user = await User.findOne({ username: req.session.user.username });
    if (user) {
      res.status(200).json({ username: user.username });
    } else {
      return res.status(200).json({ username: null });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*
  Export functions.
*/
module.exports = {
  createUser,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  loginUser,
  signupUser,
  sessionInfo,
  logoutUser,
  getAuthStatus,
  getRecipeRecommendations,
};
