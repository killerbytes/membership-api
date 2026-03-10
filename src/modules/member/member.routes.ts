import { Router } from "express";
import upload from "../../utils/upload";
import * as controller from "./member.controller";

const router = Router();

router.get("/:id", controller.get);
router.get("/", controller.list);
router.post("/register", controller.create);

router.post(
  "/upload/:type",
  (req, res, next) => {
    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    req.params.filename = req.user.id.toString();
    next();
  },
  upload.single("file"),
  controller.upload
);

export default router;
