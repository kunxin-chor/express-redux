const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const ObjectId = require("mongodb").ObjectId;
const MongoUtil = require("./MongoUtil.js");

// import routes
const foodRoutes = require("./routes/food");

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

  app.use("/food", foodRoutes);

  // 3. RUN SERVER
  app.listen(3000, () => console.log("Server started"));
}

main();
