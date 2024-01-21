import { Router } from "express";

import { board } from "../controllers";
import { limitResources } from "../middlewares/limitResources";

export const boardRouter = Router();

boardRouter.get("/", limitResources, board.getAll);
boardRouter.post("/", limitResources, board.create);
boardRouter.get("/:uri", board.getOne);
boardRouter.put("/update/:uri", board.update);
boardRouter.delete("/delete/:id", board.destroy);
