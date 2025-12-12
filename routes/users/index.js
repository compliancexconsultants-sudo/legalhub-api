const express = require("express");
const router = express.Router();

router.use("/list", require("./list"));
router.use("/details", require("./details"));

module.exports = router;
