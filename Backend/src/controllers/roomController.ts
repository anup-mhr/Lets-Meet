import { Response, Request, NextFunction } from "express";
import { roomService } from "../services/roomService";

export const roomCotroller = {
  async isRoomExist(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await roomService.isRoomExist(req.body.room_id);
      res.status(200).json({
        status: "success",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
};
