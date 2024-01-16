const express = require("express");
const router = express.Router();
const { board } = require("../controllers");
const limitResources = require("../middlewares/limitResources");

router.get("/", limitResources, board.getAll);
router.post("/", limitResources, board.create);
router.get("/:uri", board.getOne);
router.put("/update/:uri", board.update);
router.delete("/delete/:id", board.destroy);

module.exports = router;
