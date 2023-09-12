import express from "express";
import { getCurrentUser } from "../../controllers/users";
import passport from "../../middleware/authentication";

const router = express.Router();

router.get(
  "/current",
  passport.authenticate("cookie", { session: false }),
  getCurrentUser
);

export default router;
