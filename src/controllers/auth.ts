import { Request, RequestHandler, Response } from "express";
import Jwt from "jsonwebtoken";
import crypto from "crypto";
import VerificationToken from "@/models/verificationToken";
import User from "@/models/user";
import { mail } from "@/utils/mail";
import { sendErrorResponse } from "@/utils/helpers";

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

  // Looking to send emails in production? Check out our Email API/SMTP product!

  const link = `${process.env.VERIFICATION_LINK}?token=${randomToken}&userId=${user._id}`;
  await mail.sendVerificationMail({
    link,
    to: user.email,
  });
  res.status(200).json({
    message: "please check email to verify your account",
  });
};

export const verifyAuthToken: RequestHandler = async (req, res) => {
  console.log(req.query);
  const { token, userId } = req.query;

  if (typeof token !== "string" || typeof userId !== "string") {
    return sendErrorResponse({
      res,
      status: 403,
      message: "invalid token or userId",
    });
  }
  const verificationToken = await VerificationToken.findOne({ userId });
  if (!verificationToken || !(await verificationToken.verifyToken(token))) {
    return sendErrorResponse({
      res,
      status: 403,
      message: "invalid request,token mismatch",
    });
  }
  const user = await User.findById(userId);
  if (!user) {
    return sendErrorResponse({
      res,
      status: 500,
      message: "Something went wrong,user not found!",
    });
  }
  await VerificationToken.findByIdAndDelete(verificationToken._id);
  const jwtToken = Jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "16d",
  });
  res.status(200).json({ token: jwtToken });
};
