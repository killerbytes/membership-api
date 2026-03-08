import { Router } from "express";
import * as controller from "./location.controller";

const router = Router();

router.get("/cities", controller.getCities);
router.get("/barangays/:code", controller.getBarangays);

export default router;
