import { Router } from "express";

import { column } from "../controllers";

export const columnRouter = Router();

columnRouter.post("/", column.create);
columnRouter.delete("/delete/:id", column.destroy);
// router.get("/:uri", board.getOne);
// router.put("/update/:uri", board.update);
