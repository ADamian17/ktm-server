import { RequestHandler } from "express";
import { db } from "../config";
import { Prisma } from "@prisma/client";

export const create: RequestHandler = async (req, res) => {
  try {
    const limit = Number(process.env.RESOURCES_LIMIT);
    const subtasks = await db.subtask.findMany({
      where: {
        taskId: req.body.taskId,
      },
    });

    if (subtasks.length >= limit) {
      throw new Error("User has reached the maximum number of records.");
    }

    const createdSubtask = await db.subtask.create({
      data: {
        title: req.body.title,
        taskId: req.body.taskId,
      },
    });

    return res.status(201).json({ createdSubtask });
  } catch (error) {
    if (error instanceof Error) {
      const { message } = error;
      return res.status(400).json({ error: { message } });
    }

    return res.status(400).json({ error });
  }
};

export const update = async () => {};

export const destroy = async () => {};
