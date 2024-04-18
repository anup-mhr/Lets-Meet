import { Response, Request, NextFunction, ErrorRequestHandler } from "express";

type err = {
  statusCode: number;
  status: string;
  message: string;
  isOperational?: boolean;
};

const sendErrorPro = (err: err, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //this indicates the bug is in 3rd party or database
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  sendErrorPro(err, res);

  next();
};

export default globalErrorHandler;
