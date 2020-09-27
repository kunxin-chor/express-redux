const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
config = require("dotenv").config();

const MongoUtil = require("./MongoUtil.js");

async function main() {
  /* 1. SETUP EXPRESS */
  let app = express();

  // 1B. SETUP VIEW ENGINE
  app.set("view engine", "hbs");

  // 1C. SETUP STATIC FOLDER
  app.use(express.static("public"));

  // 1D. SETUP WAX ON (FOR TEMPLATE INHERITANCE)
  wax.on(hbs.handlebars);
  wax.setLayoutPath("./views/layouts");

  var helpers = require("handlebars-helpers")({
    handlebars: hbs.handlebars
  });

  // 1E. ENABLE FORMS
  app.use(express.urlencoded({ extended: false }));

  // 1F. Connect to Mongo
  await MongoUtil.connect(process.env.MONGO_URL, "cico");

  // 2. ROUTES
  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/food", async (req, res) => {
    let db = MongoUtil.getDB();
    let foodRecords = await db
      .collection("food")
      .find()
      .toArray();
    res.render("food", {
      foodRecords
    });
  });

  app.get("/food/add", (req, res) => {
    res.render("add_food");
  });

  app.post("/food/add", (req, res) => {
    let { foodName, calories, tags } = req.body;
    let db = MongoUtil.getDB();
    if (!Array.isArray(tags)) {
      tags = [tags];
    }

    db.collection("food").insertOne({
      foodName,
      calories,
      tags
    });
    res.render("display_food_summary", {
      foodName,
      calories,
      tags: tags.join(", ")
    });
  });
  // 3. RUN SERVER
  app.listen(3000, () => console.log("Server started"));
}

main();
