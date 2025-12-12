const express = require("express");
const router = express.Router();

router.use("/tags", require("./tags"));
router.use("/", require("./services"));

module.exports = router;
