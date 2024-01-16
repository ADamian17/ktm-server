const express = require("express");
const router = express.Router();
const { board } = require("../controllers");

router.get("/", board.getAll);
router.post("/", board.create);
router.get("/:uri", board.getOne);
router.put("/update/:uri", board.update);
router.delete("/delete/:id", board.destroy);

module.exports = router;
