/*
  Model for profile information.
*/
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: false,
    },
    allergies: {
      type: String,
      required: false,
    },
    cookingExperience: {
      type: String,
      required: false,
    },
    foodPreference: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String,
      required: false,
    },
    bookmarks: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Profile", profileSchema);
