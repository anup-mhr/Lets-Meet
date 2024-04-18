import express, { NextFunction, Request, Response } from "express";
import logger from "./utils/logger";
import AppError from "./utils/AppError";
import globalErrorHandler from "./middleware/globalErrorHandler";
import authRouter from "./routes/authRoute";
import roomRouter from "./routes/roomRoute";
import messageRouter from "./routes/messageRoute";
import cors from "cors";

const app = express();
//MIDDLEWARES
app.use(express.json()); //for parsing json
app.use(cors());

//ROUTES
app.use("/api/auth/", authRouter);
app.use("/api/message/", messageRouter);
app.use("/api/room/", roomRouter);

// Invalid url handling middleware
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  logger.error(`Can't find ${req.originalUrl} on this server`);
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//Global error handling middleware
app.use(globalErrorHandler);

export default app;
