/*
  Model for user information.
*/
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    age: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: false,
    },

    email: {
      type: String,
      required: false,
    },

    password: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

/*
  A function that sign-up a user.
*/
userSchema.statics.signup = async function (
  name,
  username,
  age,
  email,
  password,
) {
  /*
    Check if the username or email exist.
    This helps with making the username and email unique.
  */
  const existingUser = await this.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    throw new Error("User with the same username or email already exists");
  }
  /*
    Encrypts the password first then store in the database
    for security.
  */
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({
    name,
    age,
    username,
    email,
    password: hash,
  });
  return user;
};

module.exports = mongoose.model("User", userSchema);
