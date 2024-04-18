import { Router } from "express";
import { roomCotroller } from "../controllers/roomController";

const router = Router();

router.post("/checkRoomStatus", roomCotroller.isRoomExist);

export default router;
