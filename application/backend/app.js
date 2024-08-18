const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const userRoutes = require("./routes/users");
const recipeRoutes = require("./routes/recipes");
const profileRoutes = require("./routes/profiles");
const ImageUploadRouter = require("./routes/uploadImageRoute");

require("dotenv").config({ path: "./config.env" });
const MAX_AGE = 1000 * 60 * 60 * 3; // 3hrs
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// setting up connect-mongodb-session store
const mongoDBstore = new MongoDBStore({
  uri: process.env.ATLAS_URI,
  collection: "sessions",
});

app.use(
  session({
    secret: "csc648foodsonly",
    name: "session-id",
    store: mongoDBstore,
    cookie: {
      maxAge: MAX_AGE,
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
  }),
);

// API key authentication middleware
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid Authorization header" });
  }

  const apiKey = authHeader.split(" ")[1];

  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  next();
});

//middleware
app.use(bodyParser.json());

//routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/images", ImageUploadRouter);

module.exports = app;