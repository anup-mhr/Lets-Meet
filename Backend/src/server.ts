import dotenv from "dotenv";
import logger from "./utils/logger";
import { AppDataSource } from "./config/dbConfig";
import "reflect-metadata";

dotenv.config();
// import app from "./app";
import { server } from "./socket/socket";

const port = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(async () => {
    server.listen(port, () => {
      logger.info(`Listening on localhost port ${port}`);
      logger.info(`Documentation of API on http://localhost:${port}/api-docs`);
    });
    logger.info("Data Source has been initialized!");
  })
  .catch((error: Error) => logger.fatal(error, "error occured while connecting db"));
