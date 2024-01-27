import { RequestHandler } from "express";
import { db } from "../config";
import { Prisma } from "@prisma/client";

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

export const destroy: RequestHandler = async (req, res) => {
  try {
    const deletedColumn = await db.column.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    return res.status(200).json({ deletedColumn });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(400).json({
        error: {
          message: "Record to delete does not exist.",
        },
      });
    }

    return res.status(400).json({ error });
  }
};
