import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

export const validateSignup = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, role, firstName, lastName, businessName } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  if (!password) {
    return res.status(400).json({ error: "Missing password" });
  }

  if (!role) {
    return res.status(400).json({ error: "Missing role" });
  }

  if (!firstName) {
    return res.status(400).json({ error: "Missing first name" });
  }

  if (!lastName) {
    return res.status(400).json({ error: "Missing last name" });
  }

  // Check that role string matches one of the prisma roles
  if (!Object.values(Role).includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  // If role is related to a business, then we require business data
  if (
    role === "PROVIDER_ADMIN" ||
    role === "VENUE_ADMIN" ||
    role === "SOLE_TRADER"
  ) {
    if (!businessName) {
      return res.status(400).json({ error: "Missing business name" });
    }
  }

  next();
};
