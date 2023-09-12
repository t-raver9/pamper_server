import { NextFunction, Request, Response } from "express";
import passport from "../../middleware/authentication";

export const signupViaGoogle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /*
     The state here is needed to be able to pass data through the google auth flow. If the client passes data about the
     user that needs to be persisted once the request comes back from google, the only way that data will still be
     attached to the request when it comes back from google is by putting it in this state parameter. 
    */
  const { role } = req.query;

  if (!role) {
    return res.status(400).json({ error: "Missing role" });
  }

  const state = role
    ? Buffer.from(JSON.stringify({ role })).toString("base64")
    : undefined;

  const authenticator = passport.authenticate("google", {
    scope: ["profile", "email"],
    state: state,
  });

  authenticator(req, res, next);
};

export const loginViaGoogle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authenticator = passport.authenticate("google", {
    scope: ["profile", "email"],
  });
  authenticator(req, res, next);
};
