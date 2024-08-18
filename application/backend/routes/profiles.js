const express = require("express");
const {
  createProfile,
  getProfiles,
  getProfile,
  deleteProfile,
  updateProfile,
  UploadImage,
  searchUsers,
  addBookmark,
  getBookmarks,
  removeBookmark,
  toggleBookmark
  
} = require("../controllers/profileController");

const router = express.Router();

require("dotenv").config();
({ path: "./.env" });

/*
  Route to get all the profile.
*/
router.get("/", getProfiles);

router.get("/user/bookmarks", getBookmarks);

/*
  Search for all the users with username
  that contains the search term.
*/
router.get("/search/:term", searchUsers);

/*
  Route to get a specific profile using username.
*/
router.get("/:username", getProfile);

/*
  Make a new profile.
*/
router.post("/create", createProfile);

router.post("/:id/bookmark", toggleBookmark);

/*
  Update the specified profile.
*/
router.patch("/:username", updateProfile);

/*
  Delete the specified profile.
*/
router.delete("/:username", deleteProfile);

router.delete("/:id/bookmark", toggleBookmark);

module.exports = router;
