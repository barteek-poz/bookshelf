import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import booksRouter from "./routes/booksRoutes";
import genresRouter from "./routes/genresRoutes";
import usersRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import adminRouter from "./routes/adminRoutes";
const path = require("path");



const corsOptions: CorsOptions = {
  origin: "https://bookshelf-nou0.onrender.com",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PATCH", "DELETE"],
};

const app: Application = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/books", booksRouter);
app.use("/api/v1/genres", genresRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

export default app;
