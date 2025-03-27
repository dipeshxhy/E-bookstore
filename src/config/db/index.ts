import mongoose from "mongoose";
const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("Mongo URI is missing");
}
export const connectedDB = () => {
  mongoose
    .connect(uri)
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.log("Error connecting to database", err);
    });
};
