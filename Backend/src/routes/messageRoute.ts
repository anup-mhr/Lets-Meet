import { Router } from "express";
import { messageController } from "../controllers/messageController";
import { authentication } from "../middleware/authentication";

const router = Router();

router.get("/:roomId", authentication.verify, messageController.getMessagesOfRoom);

export default router;
