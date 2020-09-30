const express = require("express");
const {setupExpressApp} = require('./setupExpress')
const {setupHBS} = require("./setupHandlebars")
const passport = require('./passport/setup')

const ObjectId = require("mongodb").ObjectId;
const MongoUtil = require("./MongoUtil.js");
const uuid = require('uuid');

// import routes
const foodRoutes = require("./routes/food");
const userRoutes = require('./routes/user');

config = require("dotenv").config();

async function main() {

  // 1. SETUP EXPRESS
  let app = express();
  setupExpressApp(app);
  setupHBS();
  await MongoUtil.connect(process.env.MONGO_URL, "cico");

  // 2. ROUTES
  app.get("/", (req, res) => {
    res.render("index");
  });

  app.use("/food", foodRoutes);
  app.use('/user', userRoutes);
  app.use('/api', require('./routes/api'))

  // 3. RUN SERVER
  app.listen(3000, () => console.log("Server started"));
}

main();
