const express = require("express");
const router = express.Router();

router.post("/create", require("./createService"));
router.get("/list", require("./listServices"));
router.get("/:id", require("./details"));            // <-- added
router.put("/update/:id", require("./updateService"));
router.delete("/delete/:id", require("./deleteService"));

module.exports = router;
