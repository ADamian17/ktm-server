import { RequestHandler } from "express";
import { db } from "../config";

export const create: RequestHandler = async (req, res) => {
  try {
    const createdColumn = await db.column.create({
      data: {
        name: req.body.name,
      },
    });

    return res.json({ createdColumn });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
