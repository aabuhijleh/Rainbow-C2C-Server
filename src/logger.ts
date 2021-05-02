import { createLogger, transports, format } from "winston";
import { __prod__ } from "./constants";

const { combine, timestamp, printf } = format;

const customFormat = printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`;
});

export const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    customFormat
  ),
  transports: [new transports.File({ filename: "server.log" })],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (!__prod__) {
  logger.add(
    new transports.Console({
      format: customFormat,
    })
  );
}
