import { Router } from "express";

import { column } from "../controllers";

export const columnRouter = Router();

columnRouter.post("/", column.create);
// router.get("/:uri", board.getOne);
// router.put("/update/:uri", board.update);
// router.delete("/delete/:id", board.destroy);
