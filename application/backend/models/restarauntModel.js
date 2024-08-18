/*
  Model for restaurant information.
*/
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const restarauntSchema = new Schema(
  {
    restaraunt_name: {
      type: String,
      required: true,
    },

    location: {
      type: Integer,
      required: true,
    },

    foodType: {
      type: Integer,
      required: true,
    },
    Price: {
      type: String,
      required: true,
    },

    Menu: {
      type: Integer,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Restaraunt", restarauntSchema);
