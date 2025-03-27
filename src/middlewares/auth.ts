import { sendErrorResponse } from "@/utils/helpers";
import { RequestHandler } from "express";
import Jwt from "jsonwebtoken";
export const isAuth: RequestHandler = (req, res, next) => {
  const authToken = req.cookies.authToken;
  if (!authToken) {
    return sendErrorResponse({
      status: 401,
      message: "Unauthorized, please login",
      res,
    });
  }
  const decoded = Jwt.verify(authToken, process.env.JWT_SECRET!) as {
    userId: string;
  };
  console.log(decoded);
  next();
};
