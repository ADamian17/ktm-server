import { RequestHandler } from "express";
import { db } from "../config";

export const limitResources: RequestHandler = async (req, res, next) => {
  try {
    const limit = Number(process.env.RESOURCES_LIMIT);
    const urlSegment = req.baseUrl.split("/api/v1/").join("").trim();
    const key = urlSegment.substring(0, urlSegment.length - 1) as
      | "task"
      | "subtask"
      | "column"
      | "board";

    // let resource: ;

    switch (key) {
      case "board":
        break;
      case "column":
        break;
      case "task":
        break;
      case "subtask":
        break;
      default:
        break;
    }

    // const resourceCount = await resource.count({
    //   take: limit,
    // });

    // if (req.method === "POST" && resourceCount >= limit) {
    //   const e = new Error();
    //   e.message = `We are currently in Beta, only 3 ${urlSegment} are allow`;
    //   throw e;
    // }

    // req.body["resourceCount"] = resourceCount;
    next();
  } catch (error) {
    console.log(error);
    return res.json({ error });
  }
};
