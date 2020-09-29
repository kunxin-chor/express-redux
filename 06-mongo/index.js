const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const ObjectId = require("mongodb").ObjectId;
const MongoUtil = require("./MongoUtil.js");

config = require("dotenv").config();

async function main() {
  /* 1. SETUP EXPRESS */
  let app = express();

  // 1A. SETUP SESSION
  app.use(cookieParser("secret"));
  app.use(session({ cookie: { maxAge: 60000 } }));
  app.use(flash());

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

  // 1F. Register flash message middleware
  app.use(function(req, res, next) {
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
  });

  // 1G. Connect to Mongo
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
    req.flash('success_messages', "New food record has been added")
    res.redirect('/food')
  });

  app.get("/food/:foodid/edit", async (req, res) => {
    let db = MongoUtil.getDB();
    let foodRecord = await db.collection("food").findOne({
      _id: ObjectId(req.params.foodid)
    });

    res.render("edit_food", {
      foodRecord
    });
  });

  app.post("/food/:foodid/edit", async (req, res) => {
    let db = MongoUtil.getDB();
    let { foodName, calories, tags } = req.body;

    if (!Array.isArray(tags)) {
      tags = [tags];
    }

    let foodid = req.params.foodid;
    db.collection("food").updateOne(
      {
        _id: ObjectId(foodid)
      },
      {
        $set: {
          foodName,
          calories,
          tags
        }
      }
    );

    res.redirect("/food");
  });

  // 3. RUN SERVER
  app.listen(3000, () => console.log("Server started"));
}

main();
