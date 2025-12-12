const express = require("express");
const router = express.Router();

router.use("/submit", require("./submit"));
router.use("/list", require("./list"));
router.use("/details", require("./details"));
router.use("/status", require("./updateStatus"));
router.use("/assign", require("./assignCA"));
router.use("/upload-final", require("./uploadFinal"));
router.use("/user", require("./listUserCases"));

module.exports = router;
