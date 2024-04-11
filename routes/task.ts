import { Router } from "express";

import { task } from "../controllers";

export const taskRouter = Router();

taskRouter.post("/", task.create);
taskRouter.get("/:id", task.getOne);
taskRouter.put("/update/:id", task.update);
taskRouter.delete("/delete/:id", task.destroy);
