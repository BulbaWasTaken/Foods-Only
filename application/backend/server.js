const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000 || 5001;

//connect to db
mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => {
    //listen for requests
    app.listen(port, () => {
      console.log("connected to db & Server is running on port 5001");
    });
  })
  .catch((err) => {
    console.log(err);
  });