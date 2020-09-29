const express = require("express");
const hbs = require("hbs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("./passport/setup");

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

  // 1F. ENABLE PASSPORT
  app.use(passport.initialize()); // American spelling!
  app.use(passport.session());


}

function isAuthenticated(req, res, next) {
    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.isAuthenticated) return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect("/");
  }

module.exports = {
  setupExpressApp, isAuthenticated
};
