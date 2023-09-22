import express from "express";
import { listServices } from "../../controllers/services";
import passport from "../../middleware/authentication";

const router = express.Router();

router.get("/", listServices);

export default router;
