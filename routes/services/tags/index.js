const express = require("express");
const router = express.Router();

router.post("/create", require("./createTag"));
router.get("/list", require("./listTags"));
router.put("/update/:id", require("./updateTag"));
router.delete("/delete/:id", require("./deleteTag"));

module.exports = router;
