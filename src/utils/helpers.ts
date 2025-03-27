import { UserDocument } from "@/models/user";
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

export const formatUserProfile = (user: UserDocument) => {
  return {
    _id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };
};
