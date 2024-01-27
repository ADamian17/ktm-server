import { RequestHandler } from "express";
import { db } from "../config";

export const create: RequestHandler = async (req, res) => {
  try {
    const limit = Number(process.env.RESOURCES_LIMIT);
    const columns = await db.column.findMany({
      where: {
        boardId: req.body.boardId,
      },
    });

    if (columns.length >= limit) {
      throw new Error("User has reached the maximum number of records.");
    }

    const createdColumn = await db.column.create({
      data: {
        name: req.body.name,
        boardId: req.body.boardId,
      },
    });

    return res.status(201).json({ createdColumn });
  } catch (error) {
    if (error instanceof Error) {
      const { message } = error;
      return res.status(400).json({ error: { message } });
    }

    return res.status(400).json({ error });
  }
};
