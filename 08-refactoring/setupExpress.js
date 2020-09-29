const express = require("express");
const hbs = require("hbs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

function setupExpressApp(app) {
  // setup sessions and flash
  app.use(cookieParser("secret"));
  app.use(session({ cookie: { maxAge: 60000 } }));
  app.use(flash());

  // setup view engine
  app.set("view engine", "hbs");

  // SETUP STATIC FOLDER
  app.use(express.static("public"));

  // Register Flash middleware
  app.use(function(req, res, next) {
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
  });

  // 1E. ENABLE FORMS
  app.use(express.urlencoded({ extended: false }));
}

module.exports = {
  setupExpressApp
};
