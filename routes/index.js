const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("products/home");
});

module.exports = router;
