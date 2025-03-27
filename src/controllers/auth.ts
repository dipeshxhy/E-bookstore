import UserModel from "@/models/user";
import VerificationTokenModel from "@/models/verificationToken";
import crypto from "crypto";
import { RequestHandler } from "express";
import mail from "@/utils/mail";
import { formatUserProfile, sendErrorResponse } from "@/utils/helpers";
import jwt from "jsonwebtoken";

export const generateAuthLink: RequestHandler = async (req, res) => {
  const { email } = req.body;
  let user = await UserModel.findOne({ email });
  if (!user) {
    user = await UserModel.create({ email });
  }
  const userId = user._id.toString();
  const randomToken = crypto.randomBytes(32).toString("hex");

  await VerificationTokenModel.create<{ userId: string }>({
    userId,
    token: randomToken,
  });

  const link = `${process.env.VERIFICATION_LINK}?token=${randomToken}&userId=${userId}`;

  await mail.sendVerificationMail({
    to: user.email,
    link,
  });

  res.json({
    message: "Verification link has been sent to your email",
  });
};

export const verifyAuthToken: RequestHandler = async (req, res) => {
  const { token, userId } = req.query;
  if (typeof token !== "string" || typeof userId !== "string") {
    return sendErrorResponse({
      res,
      status: 403,
      message: "Invalid Request! ",
    });
  }

  const verificationToken = await VerificationTokenModel.findOne({
    userId,
  });
  if (!verificationToken || !(await verificationToken.compare(token))) {
    return sendErrorResponse({
      res,
      status: 403,
      message: "Invalid Request!,token mismatch! ",
    });
  }
  const user = await UserModel.findById(userId);
  if (!user) {
    return sendErrorResponse({
      res,
      status: 403,
      message: "something went wrong!,user not found!",
    });
  }
  await VerificationTokenModel.findByIdAndDelete(verificationToken._id);

  const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "16d",
  });
  res.cookie("authToken", authToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
  });

  res.redirect(
    `${process.env.AUTH_SUCCESS_URL}/profile=${JSON.stringify(
      formatUserProfile(user)
    )}`
  );

  res.json({
    token,
    message: "okay!",
  });
};
