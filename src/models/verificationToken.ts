import { Model, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

interface VerificationTokenDoc {
  userId: string;
  token: string;
  expires: Date;
}

interface Methods {
  compare(token: string): Promise<boolean>;
}

const verificationTokenSchema = new Schema<VerificationTokenDoc, {}, Methods>({
  userId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    default: Date.now(),
    expires: 60 * 60 * 24,
  },
});

verificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await bcrypt.hash(this.token, 10);
  }

  next();
});

verificationTokenSchema.methods.compare = async function (token) {
  return await bcrypt.compare(token, this.token);
};

const VerificationTokenModel = model(
  "VerificationToken",
  verificationTokenSchema
);

export default VerificationTokenModel as Model<
  VerificationTokenDoc,
  {},
  Methods
>;
