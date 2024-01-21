import { Router } from "express";

import { column } from "../controllers";
import { limitResources } from "../middlewares/limitResources";

export const columnRouter = Router();

columnRouter.post("/", limitResources, column.create);
// router.get("/:uri", board.getOne);
// router.put("/update/:uri", board.update);
// router.delete("/delete/:id", board.destroy);
