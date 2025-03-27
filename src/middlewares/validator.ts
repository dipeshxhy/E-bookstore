import { RequestHandler } from "express";
import { z, ZodRawShape } from "zod";

const emailValidationSchema = {
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email is invalid",
    })
    .email("Invalid email"),
};

const validate = <T extends ZodRawShape>(obj: T): RequestHandler => {
  return (req, res, next) => {
    const schema = z.object(obj);
    const result = schema.safeParse(req.body);
    if (result.success) {
      req.body = result.data;
      next();
    } else {
      const errors = result.error.flatten().fieldErrors;
      res.status(400).json({ errors });
    }
  };
};

export { validate, emailValidationSchema };
