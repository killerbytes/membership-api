import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import * as controller from "./user.controller";

const router = Router();

router.post("/", controller.create);
router.get("/current-user", verifyToken, controller.getCurrentUser);
router.get("/", verifyToken, controller.get);

export default router;
