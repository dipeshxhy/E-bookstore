import "express-async-errors";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import { connectedDB } from "./config/db/connectDB";
import { errorHandler } from "./middlewares/errorHandler";

connectedDB();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
