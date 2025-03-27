import { Request, RequestHandler, Response } from "express";
import crypto from "crypto";
import VerificationToken from "@/models/verificationToken";
import User from "@/models/user";
import { mail } from "@/utils/mail";

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
