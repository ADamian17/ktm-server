/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

const { Prisma } = require("@prisma/client");
const { db } = require("../config");

/**
 * @name getAll
 * @param {Request} req
 * @param {Response} res
 */
const getAll = async (req, res) => {
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

/**
 * @name getOne
 * @param {Request} req
 * @param {Response} res
 */
const getOne = async (req, res) => {
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

/**
 * @name create
 * @param {Request} req
 * @param {Response} res
 */
const create = async (req, res) => {
  try {
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

    return res.status(400).json({ error });
  }
};

/**
 * @name update
 * @param {Request} req
 * @param {Response} res
 */
const update = async (req, res) => {
  try {
    const columnsData = req.body.columns.map((col) => ({
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

/**
 * @name destroy
 * @param {Request} req
 * @param {Response} res
 */
const destroy = async (req, res) => {
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

module.exports = {
  getAll,
  getOne,
  create,
  update,
  destroy,
};
