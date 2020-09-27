const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");

/* 1. SETUP EXPRESS */
let app = express();

// 1B. SETUP VIEW ENGINE
app.set("view engine", "hbs");

// 1C. SETUP STATIC FOLDER
app.use(express.static("public"));

// 1D. SETUP WAX ON (FOR TEMPLATE INHERITANCE)
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// 1E. ENABLE FORMS
app.use(express.urlencoded({ extended: false }));

// 2. ROUTES
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/add_food", (req, res) => {
  res.render("add_food");
});

app.post("/add_food", (req, res) => {
  let { foodName, calories, tags } = req.body;
  res.render("display_food_summary", {
    foodName,
    calories,
    tags:tags.join(', ')
  });
});
// 3. RUN SERVER
app.listen(3000, () => console.log("Server started"));
