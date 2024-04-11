import { RequestHandler } from "express";
import { db } from "../config";
import { Prisma } from "@prisma/client";

export const getOne: RequestHandler = async (req, res) => {
  try {
    const task = await db.task.findUniqueOrThrow({
      where: {
        id: Number(req.params.id),
      },
      include: {
        subtasks: true,
      },
    });

    return res.json({ task });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({
          status: 404,
          error: {
            message: "Task not found",
          },
        });
      }
    }

    return res.json({ error });
  }
};

export const create: RequestHandler = async (req, res) => {
  try {
    const limit = Number(process.env.RESOURCES_LIMIT);
    const tasks = await db.task.findMany({
      where: {
        columnId: req.body.columnId,
      },
    });

    if (tasks.length >= limit) {
      throw new Error("User has reached the maximum number of records.");
    }

    const createdTask = await db.task.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        columnId: req.body.columnId,
        subtasks: req.body.subtasks || [],
        status: req.body.columnName,
      },
    });

    return res.status(201).json({ createdTask });
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
    const deletedTask = await db.task.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    return res.status(200).json({ deletedTask });
  } catch (error) {
    if (error instanceof Error) {
      const { message } = error;
      return res.status(400).json({ error: { message } });
    }

    return res.status(400).json({ error });
  }
};
