import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import * as controller from "./user.controller";

const router = Router();

router.post("/", controller.create);
router.get("/", verifyToken, controller.getAll);
router.get("/:id", verifyToken, controller.get);

export default router;
