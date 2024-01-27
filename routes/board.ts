import { Router } from "express";

import { board } from "../controllers";

export const boardRouter = Router();

boardRouter.get("/", board.getAll);
boardRouter.post("/", board.create);
boardRouter.get("/:uri", board.getOne);
boardRouter.put("/update/:uri", board.update);
boardRouter.delete("/delete/:id", board.destroy);
