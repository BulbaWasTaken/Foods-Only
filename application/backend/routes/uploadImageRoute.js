/*
  A route for cloudinary.

  NOTE: Might delete since uploading an image
  to cloudinary works at the frontend.
*/

const express = require("express");
const { deleteImage } = require("../controllers/profileController");

const router = express.Router();
require("dotenv").config();
({ path: "./.env" });

router.delete("/deleteImage", deleteImage);

module.exports = router;
