import express from "express";
import session from "express-session";
import path from "path";
import { logger } from "./logger";
import { getStringFromError } from "./utils/getStringFromError";

const app = express();

app.use(express.static(path.join(__dirname, "../public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use((req, _, next) => {
  logger.info(req.path);
  next();
});

app.use((err, req, res, next) => {
  logger.info(`${req.path} - error?:[${!!err}]`);
  if (err) {
    logger.error(`Error caught: [${getStringFromError(err)}]`);
    return res.status(500).send(err);
  }
  next();
});

export { app };
