import express from "express";

import { boardRouter } from "./board";
import { columnRouter } from "./column";

export const routes = express.Router();

routes.use("/boards", boardRouter);
routes.use("/columns", columnRouter);
