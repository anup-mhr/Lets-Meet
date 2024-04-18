import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { userService } from "../services/userService";
import { User } from "../models/User";
import AppError from "../utils/AppError";

interface CustomRequest extends Request {
  user?: User;
}

export const authentication = {
  async verify(req: CustomRequest, res: Response, next: NextFunction): Promise<User | null | void> {
    try {
      logger.info("Starting token verification process");

      // 1) getting token and check its there
      if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
        logger.error("Token not found in headers");
        return next(new AppError("You are not logged in! Please login to get access", 401));
      }

      const token = req.headers.authorization.split(" ")[1];

      // 2) validate token
      if (!process.env.JWT_SECRET) {
        logger.fatal("JWT_SECRET not defined in env variable");
        return next(new AppError("Internal Server Error", 500));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
      logger.info("Token validated successfully");

      // 3) check if user still exist
      const user = await userService.getUserById(decoded.id);
      if (!user) {
        logger.error("User belonging to this token does not exist");
        return next(new AppError("The user belonging to this token does not longer exist", 401));
      }

      logger.info("User retrieved successfully");
      // 4) grant access to protected routes
      req.user = user;
      next();
    } catch (err) {
      logger.error("Error occurred during token verification", { error: err });
      next(new AppError("JWT token expired", 401));
    }
  },
};
