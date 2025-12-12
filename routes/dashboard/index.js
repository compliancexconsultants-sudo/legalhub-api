const express = require("express");
const router = express.Router();

router.use("/stats", require("./statistic"));

module.exports = router;
