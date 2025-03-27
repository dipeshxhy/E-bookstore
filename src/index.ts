import express from "express";
import authRouter from "./routes/auth";
import { connectedDB } from "./config/db/connectDB";

connectedDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
