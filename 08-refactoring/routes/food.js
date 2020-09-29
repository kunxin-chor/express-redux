const express = require("express");
const router = express.Router();
const MongoUtil = require('../MongoUtil');

router.get("/", async (req, res) => {
  let db = MongoUtil.getDB();
  let foodRecords = await db
    .collection("food")
    .find()
    .toArray();
  res.render("food", {
    foodRecords
  });
});

router.get("/add", (req, res) => {
  res.render("add_food");
});

router.post("/add", (req, res) => {
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
  req.flash("success_messages", "New food record has been added");
  res.redirect("/food");
});

router.get("/:foodid/edit", async (req, res) => {
  let db = MongoUtil.getDB();
  let foodRecord = await db.collection("food").findOne({
    _id: ObjectId(req.params.foodid)
  });

  res.render("edit_food", {
    foodRecord
  });
});

router.post("/:foodid/edit", async (req, res) => {
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

module.exports = router;
