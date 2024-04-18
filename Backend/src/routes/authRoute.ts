import { Router } from "express";
import { userController } from "../controllers/userController";
import { authentication } from "../middleware/authentication";

const router = Router();

router.post("/signup", userController.createUser);
router.post("/login", userController.login);
router.get("/logout", authentication.verify, userController.logout);
router.get("/getUsername", authentication.verify, userController.getUsername);

export default router;
