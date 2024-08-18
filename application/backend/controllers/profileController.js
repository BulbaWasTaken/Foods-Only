const Profile = require("../models/profileModel");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
require("dotenv").config({ path: "./config.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
/*
  Get all user profiles from the database
*/
const getProfiles = async (req, res) => {
  const profiles = await Profile.find({}).sort({ createdAt: -1 });
  res.status(200).json({ profiles });
};

/*
  Get a single user profile from the database using username as 
  the search value.
*/
const getProfile = async (req, res) => {
  const { username } = req.params;

  try {
    /*
      Search for the data using username.
      If the profile does not exits, return an error
    */
    const profile = await Profile.findOne({ username });
    if (!profile) {
      return res.status(404).json({ error: "No such profile" });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/*
  Create a profile in the database.
*/
const createProfile = async (req, res) => {
  const {
    username,
    bio,
    allergies,
    cookingExperience,
    foodPreference,
    profileImage,
  } = req.body;
  try {
    const profile = await Profile.create({
      username,
      bio,
      allergies,
      cookingExperience,
      foodPreference,
      profileImage,
    });
    res.status(200).json({ profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error adding new profile:", error);
  }
};
/*
  Delete the specified profile in the database
*/
const deleteProfile = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such profile" });
  }
  const profile = await Profile.findOneAndDelete({ _id: id });
  if (!profile) {
    return res.status(404).json({ error: "No such profile" });
  }
  res.status(200).json({ profile });
};


const toggleBookmark = async (req, res) => {
  const { id } = req.params;  // Recipe or post ID from URL
  const { username } = req.body;  // Assuming username is stored in session

  try {
    // Find the profile of the user
    const profile = await Profile.findOne({ username });
    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    const bookmarkIndex = profile.bookmarks.indexOf(id);
    if (bookmarkIndex === -1) {
      // If the ID is not bookmarked, add it
      profile.bookmarks.push(id);
      console.log(`Bookmark added for ${username}: ${id}`);
    } else {
      // If the ID is already bookmarked, remove it
      profile.bookmarks.splice(bookmarkIndex, 1);
      console.log(`Bookmark removed for ${username}: ${id}`);
    }

    // Save the changes to the profile
    await profile.save();

    // Respond with the updated list of bookmarks and a message
    res.status(200).json({
      message: `Bookmark ${bookmarkIndex === -1 ? 'added' : 'removed'}`,
      bookmarks: profile.bookmarks
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




const getBookmarks = async (req, res) => {
  const { username } = req.body;
  console.log(`Attempting to fetch bookmarks for user: ${username}`);
  try {
    const profile = await Profile.findOne({ username });
    if (!profile) {
      console.log(`No profile found for username: ${username}`);
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ bookmarks: profile.bookmarks });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/*
  Update the specified profile in the database
*/
const updateProfile = async (req, res) => {
  const {
    username,
    bio,
    allergies,
    cookingExperience,
    foodPreference,
    profileImage,
  } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  try {
    const profile = await Profile.findOneAndUpdate(
      { username },
      {
        username,
        bio,
        allergies,
        cookingExperience,
        foodPreference,
        profileImage,
      },
      {
        new: true,
      },
    );

    if (!profile) {
      return res.status(404).json({ error: "No such profile" });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/*
  Delete the image in cloudinary.
*/
const deleteImage = async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.body.publicId, { invalidate: true });
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};

const searchUsers = async (req, res, next) => {
  const { term } = req.params;

  // Case-insensitive search using regular expression
  const searchRegex = new RegExp(term, "i");
  try {
    const profiles = await Profile.find({
      $or: [{ username: searchRegex }],
    }).sort({ createdAt: -1 }); // Sort by creation date (descending)
    res.status(200).json({ profiles });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/*
  Export functions.
*/
module.exports = {
  createProfile,
  getProfiles,
  getProfile,
  deleteProfile,
  updateProfile,
  deleteImage,
  searchUsers,
  toggleBookmark,
  getBookmarks
};
