import dotenv from "dotenv";
dotenv.config();
import { BaseResponse } from "./base/types/baseResponse";
import { specs } from "./middleware/swagger.middleware";
import express, { NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import actorRoute from "./route/actor.route";
import filmRoute from "./route/film.route";
import path from "path";
import logger from "./services/logger.service";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});
app.use("/actors", actorRoute);
app.use("/films", filmRoute);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);
app.use((_, res: BaseResponse) => {
  logger.log({
    level: "error",
    url: _.originalUrl,
    message: "Not Found",
    method: _.method,
  });

  res.status(404).json({ ok: false, message: "Not Found", data: null });
});

app.listen(process.env.PORT, () => {
  logger.log({
    level: "info",
    message: `Server is running on port ${process.env.PORT}`,
  });
  // console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
