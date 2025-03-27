import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  token: { type: String, required: true },
  expires: { type: Date, default: Date.now, expires: 60 * 60 * 24 },
});
const VerificationToken = mongoose.model(
  "VerificationToken",
  verificationTokenSchema
);

export default VerificationToken;
