import { Response, Request, NextFunction } from "express";
import { userService } from "../services/userService";
import { User } from "../models/User";
import AppError from "../utils/AppError";

interface CustomRequest extends Request {
  user?: User;
}

export const userController = {
  async getUsername(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError("user not found", 404);
      const data = await userService.getUsername(req.user.user_id);
      res.status(200).json({
        status: "success",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await userService.createUser(req.body);
      res.status(201).json({
        status: "success",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, username } = await userService.login(req.body);
      res.status(200).json({
        status: "success",
        token,
        username,
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      //   req.cookies('jwt', '',0)
      res.status(204).json({
        status: "success",
      });
    } catch (error) {
      next(error);
    }
  },
};
