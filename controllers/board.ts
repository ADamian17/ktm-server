import { RequestHandler } from "express";
import { db } from "../config";
import { Prisma } from "@prisma/client";

export const getAll: RequestHandler = async (req, res) => {
  try {
    const boards = await db.board.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        _count: true,
      },
    });

    return res.json({ boards, count: req.body.resourceCount });
  } catch (error) {
    return res.json({ error });
  }
};

export const getOne: RequestHandler = async (req, res) => {
  try {
    const board = await db.board.findUniqueOrThrow({
      where: {
        uri: `/${req.params.uri}/`,
      },
      include: {
        columns: {
          include: {
            tasks: {
              include: {
                subtasks: true,
              },
            },
          },
        },
      },
    });

    return res.json({ board });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({
          status: 404,
          error: {
            message: "Board not found",
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
    const boardCount = await db.board.count({
      take: limit,
    });

    if (boardCount >= limit) {
      throw new Error("User has reached the maximum number of records.");
    }

    const createdBoard = await db.board.create({
      data: {
        name: req.body.name,
        uri: `/${req.body.name.toLowerCase().replace(/\s+/g, "-")}/`,
        columns: {
          create: req.body.columns || [],
        },
      },
    });

    return res.json({ createdBoard });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === "P2002") {
        return res.status(400).json({
          error: {
            message: "Board name needs to be unique",
          },
        });
      }
    }

    if (error instanceof Error) {
      const { message } = error;
      return res.status(400).json({ error: { message } });
    }

    return res.status(400).json({ error });
  }
};

export const update: RequestHandler = async (req, res) => {
  try {
    const columnsData = req.body.columns.map((col: any) => ({
      data: {
        name: col.name,
      },
      where: {
        id: col.id,
      },
    }));

    const updatedBoard = await db.board.update({
      where: {
        id: req.body.boardId,
      },
      data: {
        name: req.body.name,
        uri: `/${req.body.name.toLowerCase().replace(/\s+/g, "-")}/`,
        columns: {
          update: columnsData,
        },
      },
      include: {
        columns: true,
      },
    });

    return res.json({ updatedBoard });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return res.status(400).json({
            error: {
              message: "Board name needs to be unique",
            },
          });
        case "P2025":
          return res.status(400).json({
            error: {
              message: "Record to delete does not exist.",
            },
          });
        default:
          break;
      }
    }

    return res.status(400).json({ error });
  }
};

export const destroy: RequestHandler = async (req, res) => {
  try {
    const deletedBoard = await db.board.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    return res.json({ deletedBoard });
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
