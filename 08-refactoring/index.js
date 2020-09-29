const express = require("express");
const {setupExpressApp} = require('./setupExpress')
const {setupHBS} = require("./setupHandlebars")


const ObjectId = require("mongodb").ObjectId;
const MongoUtil = require("./MongoUtil.js");

// import routes
const foodRoutes = require("./routes/food");

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

  // 3. RUN SERVER
  app.listen(3000, () => console.log("Server started"));
}

main();
