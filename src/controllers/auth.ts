import { Request, RequestHandler, Response } from "express";
import crypto from "crypto";

export const authGenerateLink: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const randomToken = crypto.randomBytes(32).toString("hex");
};
