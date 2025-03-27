import mongoose from "mongoose";
import bcrypt from "bcryptjs";

interface VerificationTokenDocument extends mongoose.Document {
  userId: string;
  token: string;
  expires: Date;
  verifyToken: (token: string) => Promise<boolean>;
}
const verificationTokenSchema = new mongoose.Schema<VerificationTokenDocument>({
  userId: {
    type: String,
    required: true,
  },
  token: { type: String, required: true },
  expires: { type: Date, default: Date.now, expires: 60 * 60 * 24 },
});
verificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});

verificationTokenSchema.methods.verifyToken = async function (token: string) {
  return await bcrypt.compare(token, this.token);
};

const VerificationToken = mongoose.model(
  "VerificationToken",
  verificationTokenSchema
);

export default VerificationToken as mongoose.Model<VerificationTokenDocument>;
