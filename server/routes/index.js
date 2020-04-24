const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  res.end("Here return data!");
});

module.exports = router;
