import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import * as controller from "./auth.controller";

const router = Router();

router.post("/login", controller.login);
router.post("/refresh", controller.refresh);
router.get("/current-user", verifyToken, controller.getCurrentUser);

export default router;
