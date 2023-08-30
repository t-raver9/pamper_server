import express from "express";
import {
  signup,
  login,
  getCurrentUser,
  googleAuth,
  googleAuthCallback,
} from "../controllers/userController";
import passport from "../middleware/auth";

const router = express.Router();

router.get("/", (req, res) => res.send("Homepage"));
router.post("/signup", signup);
router.post("/login", login);
router.get(
  "/users/current",
  passport.authenticate("cookie", { session: false }),
  getCurrentUser
);
router.get("/auth/google/signup", (req, res, next) => {
  const { role } = req.query;
  const state = role
    ? Buffer.from(JSON.stringify({ role })).toString("base64")
    : undefined;

  const authenticator = passport.authenticate("google", {
    scope: ["profile", "email"],
    state,
  });

  authenticator(req, res, next);
});
router.get("/auth/google/login", (req, res, next) => {
  const authenticator = passport.authenticate("google", {
    scope: ["profile", "email"],
  });
  authenticator(req, res, next);
});

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  googleAuthCallback
);

export default router;
