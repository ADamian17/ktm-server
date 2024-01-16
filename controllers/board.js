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
        columns: true,
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
    const board = await db.board.findUnique({
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
    const boardsCount = await db.board.count({ take: 4 });

    if (boardsCount >= 3) {
      throw new Error("We are currently on Beta, only 3 boards are allow");
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
