import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import logger from "morgan";
import path from "path";
import apiRouter from "./routes/api/";
dotenv.config({ path: path.resolve("..", ".env") });

const app: express.Application = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());

app.use("/api", apiRouter);

if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(path.resolve(__dirname, "..", "..", "client", "public")),
  );

  app.get("*", (_: express.Request, res: express.Response) => {
    res.sendFile(
      path.resolve(__dirname, "..", "..", "client", "public", "index.html"),
    );
  });
}

export default app;
