import Transport, { type TransportStreamOptions } from "winston-transport";
import { PrismaClient } from "@prisma/client";

export interface PrismaTransporterOptions extends TransportStreamOptions {
  prisma: PrismaClient;
  tableName?: string;
}

export interface PrismaTransporterInfo {
  level: string;
  message: string;
}

export class PrismaWinstonTransporter extends Transport {
  private prisma: PrismaClient;
  private tableName: string;

  constructor(opts: PrismaTransporterOptions) {
    super(opts);

    this.prisma = opts.prisma;
    this.tableName =
      opts.tableName || "logs" || "user_logs" || "login_logs" || "request_logs";
  }

  log(info: PrismaTransporterInfo, callback: Function): void {
    // get log content
    const { level, message } = info;

    setImmediate(async () => {
      this.emit("logged", info);
      // @ts-ignore
      await this.prisma[this.tableName].create({
        data: {
          level,
          message,
          timestamp: new Date(),
        },
      });
    });

    callback();
  }
}
