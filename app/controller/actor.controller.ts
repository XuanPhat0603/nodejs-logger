import { BaseResponse } from "./../base/types/baseResponse";
import { Request } from "express";
import { prisma } from "../lib/prisma";
import logger from "../services/logger.service";

export const getActor = async (req: Request, res: BaseResponse) => {
  logger.log({
    level: "info",
    message: "getActor",
    url: req.originalUrl,
    method: req.method,
  });

  const actors = await prisma.actor.findMany();
  res.json({ ok: true, data: actors });
};

export const postActor = async (req: Request, res: BaseResponse) => {
  logger.log({
    level: "info",
    message: "postActor",
    url: req.originalUrl,
    method: req.method,
  });

  const actor = await prisma.actor.create({
    data: {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    },
  });
  res.json({ ok: true, data: actor });
};
