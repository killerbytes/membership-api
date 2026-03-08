import { Router } from "express";
import * as controller from "./member.controller";

const router = Router();

router.get("/:id", controller.get);
router.get("/", controller.list);
router.post("/register", controller.create);

export default router;
