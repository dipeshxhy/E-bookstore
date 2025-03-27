import { authGenerateLink } from "@/controllers/auth";
import { emailValidationSchema, validate } from "@/middlewares/validator";
import { Router } from "express";

const authRouter = Router();

authRouter.post(
  "/generate-link",
  validate(emailValidationSchema),
  authGenerateLink
);

export default authRouter;
