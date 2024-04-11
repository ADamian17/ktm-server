import express from "express";

import { boardRouter } from "./board";
import { columnRouter } from "./column";
import { subtaskRouter } from "./subtask";
import { taskRouter } from "./task";

export const routes = express.Router();

routes.use("/boards", boardRouter);
routes.use("/columns", columnRouter);
routes.use("/subtasks", subtaskRouter);
routes.use("/tasks", taskRouter);
