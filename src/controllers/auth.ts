import { Request, RequestHandler, Response } from "express";
import crypto from "crypto";
import VerificationToken from "@/models/verificationToken";
import User from "@/models/user";

export const authGenerateLink: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email });
  }
  const randomToken = crypto.randomBytes(32).toString("hex");
  await VerificationToken.create<{ userId: string }>({
    userId: user._id.toString(),
    token: randomToken,
  });
};
