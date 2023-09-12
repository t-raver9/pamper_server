import express from "express";
// Move this to the auth controller when you can be fucked
import { googleAuthCallback } from "../../controllers/users";
import { login, signup } from "../../controllers/authentication";
import passport from "../../middleware/authentication";
import { loginViaGoogle, signupViaGoogle } from "./helpers";

const router = express.Router();

// Custom authentication
router.post("/signup", signup);
router.post("/login", login);

// Google authentication
router.get("/google/signup", signupViaGoogle);
router.get("/google/login", loginViaGoogle);
router.get(
  "/google/callback",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  googleAuthCallback
);

export default router;
