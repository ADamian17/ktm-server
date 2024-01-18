/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

const { db } = require("../config");

/**
 * @name getAll
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
module.exports = async (req, res, next) => {
  try {
    const limit = Number(process.env.RESOURCES_LIMIT);
    const urlSegment = req.baseUrl.split("/api/v1/").join("").trim();
    const resource = db[urlSegment.substring(0, urlSegment.length - 1)];
    const resourceCount = await resource.count({
      take: limit,
    });

    if (req.method === "POST" && resourceCount >= limit) {
      const e = new Error();
      e.message = `We are currently in Beta, only 3 ${urlSegment} are allow`;
      throw e;
    }

    req.body["resourceCount"] = resourceCount;
    next();
  } catch (error) {
    console.log(error);
    return res.json({ error });
  }
};
