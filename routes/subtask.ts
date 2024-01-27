import { Router } from "express";

import { subtask } from "../controllers";

export const subtaskRouter = Router();

subtaskRouter.post("/", subtask.create);
subtaskRouter.put("/update/:id", subtask.update);
subtaskRouter.delete("/delete/:id", subtask.destroy);
