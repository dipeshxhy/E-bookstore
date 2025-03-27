import { Response } from "express";

export const sendErrorResponse = ({
  res,
  status,
  message,
}: {
  res: Response;
  status: number;
  message: string;
}) => {
  res.status(status).json({ message });
};
