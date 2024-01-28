import { RequestHandler } from "express";
import { db } from "../config";

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

export const update: RequestHandler = async (req, res) => {
  try {
    const updatedSubtask = await db.subtask.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        isCompleted: req.body.isCompleted,
      },
    });

    return res.status(200).json({ updatedSubtask });
  } catch (error) {
    if (error instanceof Error) {
      const { message } = error;
      return res.status(400).json({ error: { message } });
    }

    return res.status(400).json({ error });
  }
};

export const destroy: RequestHandler = async (req, res) => {
  try {
    const deletedSubtask = await db.subtask.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    return res.status(200).json({ deletedSubtask });
  } catch (error) {
    if (error instanceof Error) {
      const { message } = error;
      return res.status(400).json({ error: { message } });
    }

    return res.status(400).json({ error });
  }
};
