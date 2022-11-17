import { createLogger, format, transports } from "winston";
import { PrismaWinstonTransporter } from "./prisma.transporter";
import { prisma } from "../lib/prisma";

const { combine, timestamp, printf } = format;

// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6,
// };

const logFormat = printf(({ level, url, method, message, timestamp }) => {
  return `${timestamp} ${level}: ${url} ${method} ${message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new transports.File({
      filename: "./logs/error.log",
      level: "error",
    }),
    new transports.File({ filename: "./logs/combined.log" }),
    new PrismaWinstonTransporter({
      prisma,
      tableName: `logs`,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console());
}

export default logger;
